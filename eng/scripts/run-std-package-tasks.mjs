import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { isAbsolute, join } from "node:path";
import { tmpdir } from "node:os";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    args[key] = next && !next.startsWith("--") ? next : "true";
    if (next && !next.startsWith("--")) i += 1;
  }
  return args;
}

function quoteWindowsShellArg(value) {
  return `"${String(value).replace(/([\\"])/g, "\\$1")}"`;
}

function spawnCommand(command, args, options) {
  if (process.platform === "win32" && (command === "pnpm" || command === "npm")) {
    return spawnSync([command, ...args].map(quoteWindowsShellArg).join(" "), {
      shell: true,
      ...options,
    });
  }

  return spawnSync(command, args, options);
}

function run(command, args, options = {}) {
  const result = spawnCommand(command, args, {
    stdio: "inherit",
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status ?? 1}.`);
}

function runStatus(command, args, options = {}) {
  const result = spawnCommand(command, args, {
    encoding: "utf8",
    stdio: "pipe",
    ...options,
  });
  if (result.error) throw result.error;
  return result;
}

function runOutput(command, args, options = {}) {
  const result = spawnCommand(command, args, {
    encoding: "utf8",
    stdio: "pipe",
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    process.stdout.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status ?? 1}.`);
  }
  return result.stdout.trim();
}

function readManifest(dir) {
  return JSON.parse(readFileSync(`${dir}/package.json`, "utf8"));
}

function readStdManifests() {
  return new Map(
    readdirSync("std", { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => `std/${entry.name}`)
      .filter((dir) => existsSync(`${dir}/package.json`))
      .map((dir) => {
        const manifest = readManifest(dir);
        return [manifest.name, manifest];
      }),
  );
}

function isWorkspaceRange(range) {
  return typeof range === "string" && /^(?:workspace|workflow):\s*\*$/.test(range);
}

function assertNeostdPackage(dir) {
  const manifest = readManifest(dir);
  if (!manifest.name?.startsWith("@neostd/")) {
    throw new Error(`${dir} must use the @neostd scope before publishing.`);
  }
}

function npmVersionPublished(dir) {
  const manifest = readManifest(dir);
  const result = runStatus("pnpm", [
    "view",
    `${manifest.name}@${manifest.version}`,
    "version",
    "--json",
  ]);
  if (result.status !== 0) return false;

  try {
    return JSON.parse(result.stdout) === manifest.version;
  } catch {
    return result.stdout.trim().replace(/^"|"$/g, "") === manifest.version;
  }
}

async function jsrPackageVersionPublished(name, version) {
  const response = await fetch(`https://jsr.io/${name}/meta.json`);
  if (response.status === 404) return false;
  if (!response.ok)
    throw new Error(`Failed to check JSR package metadata for ${name}: ${response.status}`);

  const metadata = await response.json();
  return Boolean(metadata.versions?.[version]);
}

async function jsrVersionPublished(dir) {
  const manifest = readManifest(dir);
  return jsrPackageVersionPublished(manifest.name, manifest.version);
}

function internalWorkspaceDependencies(dir) {
  const manifest = readManifest(dir);
  const stdManifests = readStdManifests();
  const deps = {
    ...manifest.dependencies,
    ...manifest.peerDependencies,
  };

  return Object.entries(deps)
    .filter(([, range]) => isWorkspaceRange(range))
    .map(([name]) => {
      const dependency = stdManifests.get(name);
      if (!dependency)
        throw new Error(`${dir} depends on ${name}, but ${name} is not a std package.`);
      return dependency;
    });
}

async function unpublishedInternalJsrDependencies(dir) {
  const unpublished = [];
  for (const dependency of internalWorkspaceDependencies(dir)) {
    if (!(await jsrPackageVersionPublished(dependency.name, dependency.version)))
      unpublished.push(dependency);
  }
  return unpublished;
}

async function waitForInternalJsrDependencies(dir) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const unpublished = await unpublishedInternalJsrDependencies(dir);
    if (unpublished.length === 0) return;

    const names = unpublished
      .map((dependency) => `${dependency.name}@${dependency.version}`)
      .join(", ");
    if (attempt === 11) throw new Error(`${dir} has unpublished JSR dependencies: ${names}`);
    console.log(`Waiting for JSR dependencies for ${dir}: ${names}`);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

function withPackedTarball(dir, callback) {
  const outDir = mkdtempSync(join(tmpdir(), "neostd-pack-"));
  try {
    const output = runOutput("pnpm", ["--dir", dir, "pack", "--pack-destination", outDir]);
    const tarball = output.split(/\r?\n/).findLast((line) => line.trim().endsWith(".tgz"));
    if (!tarball) throw new Error(`Could not find packed tarball in pnpm pack output for ${dir}.`);
    const tarballPath = tarball.trim();
    return callback(isAbsolute(tarballPath) ? tarballPath : join(outDir, tarballPath));
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
}

async function withJsrPackageJson(dir, restore, callback) {
  const packagePath = `${dir}/package.json`;
  const denoPath = `${dir}/deno.json`;
  const original = readFileSync(packagePath, "utf8");
  const originalDeno = existsSync(denoPath) ? readFileSync(denoPath, "utf8") : undefined;
  const manifest = JSON.parse(original);
  const stdManifests = readStdManifests();
  let changed = false;
  const imports = {};

  for (const section of ["dependencies", "peerDependencies"]) {
    if (!manifest[section]) continue;
    for (const [name, range] of Object.entries(manifest[section])) {
      if (!isWorkspaceRange(range)) continue;

      const dependency = stdManifests.get(name);
      if (!dependency)
        throw new Error(
          `${dir} ${section}.${name} uses ${range}, but ${name} is not a std package.`,
        );

      manifest[section][name] = `jsr:${name}@${dependency.version}`;
      imports[name] = `jsr:${name}@${dependency.version}`;
      imports[`${name}/`] = `jsr:${name}@${dependency.version}/`;
      changed = true;
    }
  }

  if (changed) writeFileSync(packagePath, `${JSON.stringify(manifest, null, 2)}\n`);
  if (Object.keys(imports).length > 0) {
    const jsrConfig = existsSync(`${dir}/jsr.json`)
      ? JSON.parse(readFileSync(`${dir}/jsr.json`, "utf8"))
      : {};
    const denoConfig = originalDeno ? JSON.parse(originalDeno) : jsrConfig;
    denoConfig.imports = {
      ...denoConfig.imports,
      ...imports,
    };
    writeFileSync(denoPath, `${JSON.stringify(denoConfig, null, 2)}\n`);
  }

  try {
    return await callback();
  } finally {
    if (restore && changed) writeFileSync(packagePath, original);
    if (restore && Object.keys(imports).length > 0) {
      if (originalDeno === undefined) {
        rmSync(denoPath, { force: true });
      } else {
        writeFileSync(denoPath, originalDeno);
      }
    }
  }
}

function assertTagRelease(dir) {
  const ref = process.env.GITHUB_REF || "";
  const refName = process.env.GITHUB_REF_NAME || "";
  if (!ref.startsWith("refs/tags/std/v")) {
    throw new Error("Publishing is only allowed from std release tags.");
  }

  if (!/^std\/v\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(refName))
    throw new Error(`Invalid std release tag: ${refName}`);
}

function hasScript(dir, script) {
  return Boolean(readManifest(dir).scripts?.[script]);
}

function hasDenoConfig(dir) {
  return existsSync(`${dir}/deno.json`) || existsSync(`${dir}/deno.jsonc`);
}

function hasJsrConfig(dir) {
  return existsSync(`${dir}/jsr.json`) || existsSync(`${dir}/jsr.jsonc`) || hasDenoConfig(dir);
}

function validatePackage(dir) {
  if (!/^std\/[A-Za-z0-9._-]+$/.test(dir) || !existsSync(`${dir}/package.json`)) {
    throw new Error(`Invalid std package: ${dir}`);
  }
}

async function runTask(dir, task) {
  console.log(`==> ${dir}: ${task}`);
  switch (task) {
    case "check":
      run("pnpm", ["--dir", dir, "exec", "vp", "check"]);
      break;
    case "build":
      run("pnpm", ["--dir", dir, "exec", "vp", "pack"]);
      break;
    case "node-test":
      run("pnpm", ["--dir", dir, "run", "test"]);
      break;
    case "bun-test":
      if (hasScript(dir, "test:bun")) run("pnpm", ["--dir", dir, "run", "test:bun"]);
      break;
    case "deno-test":
      if (hasScript(dir, "test:deno") && hasDenoConfig(dir))
        run("pnpm", ["--dir", dir, "run", "test:deno"]);
      break;
    case "npm-publish-dry-run":
      assertNeostdPackage(dir);
      if (npmVersionPublished(dir)) {
        console.log(
          `Skipping npm dry-run for ${dir}: ${readManifest(dir).version} is already published.`,
        );
        break;
      }
      withPackedTarball(dir, (tarball) =>
        run("npm", ["publish", tarball, "--dry-run", "--access", "public"]),
      );
      break;
    case "jsr-publish-dry-run":
      assertNeostdPackage(dir);
      if (hasJsrConfig(dir)) {
        if (await jsrVersionPublished(dir)) {
          console.log(
            `Skipping JSR dry-run for ${dir}: ${readManifest(dir).version} is already published.`,
          );
          break;
        }
        const unpublished = await unpublishedInternalJsrDependencies(dir);
        if (unpublished.length > 0) {
          const names = unpublished
            .map((dependency) => `${dependency.name}@${dependency.version}`)
            .join(", ");
          console.log(
            `Skipping JSR dry-run for ${dir}: internal JSR dependencies are not published yet: ${names}.`,
          );
          break;
        }
        await withJsrPackageJson(dir, true, async () =>
          run("deno", ["publish", "--dry-run", "--allow-dirty"], { cwd: dir }),
        );
      } else {
        console.log(
          `Skipping JSR dry-run for ${dir}: no jsr.json, jsr.jsonc, deno.json, or deno.jsonc.`,
        );
      }
      break;
    case "npm-publish":
      assertTagRelease(dir);
      assertNeostdPackage(dir);
      if (npmVersionPublished(dir)) {
        console.log(
          `Skipping npm publish for ${dir}: ${readManifest(dir).version} is already published.`,
        );
        break;
      }
      withPackedTarball(dir, (tarball) => run("npm", ["publish", tarball, "--access", "public"]));
      break;
    case "jsr-publish":
      assertTagRelease(dir);
      assertNeostdPackage(dir);
      if (hasJsrConfig(dir)) {
        if (await jsrVersionPublished(dir)) {
          console.log(
            `Skipping JSR publish for ${dir}: ${readManifest(dir).version} is already published.`,
          );
          break;
        }
        await waitForInternalJsrDependencies(dir);
        await withJsrPackageJson(dir, false, async () => {
          run("deno", ["publish", "--dry-run", "--allow-dirty"], { cwd: dir });
          run("deno", ["publish", "--allow-dirty"], { cwd: dir });
        });
      } else {
        console.log(
          `Skipping JSR publish for ${dir}: no jsr.json, jsr.jsonc, deno.json, or deno.jsonc.`,
        );
      }
      break;
    case "release-dry-run":
      await runTask(dir, "check");
      await runTask(dir, "build");
      await runTask(dir, "node-test");
      await runTask(dir, "bun-test");
      await runTask(dir, "deno-test");
      await runTask(dir, "npm-publish-dry-run");
      await runTask(dir, "jsr-publish-dry-run");
      break;
    case "release-publish":
      await runTask(dir, "npm-publish");
      await runTask(dir, "jsr-publish");
      break;
    default:
      throw new Error(`Unknown std package task: ${task}`);
  }
}

const args = parseArgs(process.argv.slice(2));
const task = args.task;
const packages = (args.packages || process.env.PACKAGES || "")
  .split(/\s+/)
  .filter(Boolean)
  .map((dir) => dir.replace(/\\/g, "/"));

if (!task) throw new Error("Missing --task.");
if (packages.length === 0) {
  console.log("No std packages selected.");
  process.exit(0);
}

for (const dir of packages) {
  validatePackage(dir);
  await runTask(dir, task);
}
