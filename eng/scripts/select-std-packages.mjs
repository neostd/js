import { appendFileSync, existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

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

function readStdPackages() {
  const packageDirs = readdirSync("std", { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join("std", entry.name).replace(/\\/g, "/"))
    .filter((dir) => existsSync(join(dir, "package.json")));

  return new Map(
    packageDirs.map((dir) => [dir, JSON.parse(readFileSync(join(dir, "package.json"), "utf8"))]),
  );
}

function gitDiffFiles(base, head) {
  if (!base || !head || /^0+$/.test(base)) return null;
  const result = spawnSync("git", ["diff", "--name-only", base, head], { encoding: "utf8" });
  if (result.status !== 0) return null;
  return result.stdout.split(/\r?\n/).filter(Boolean);
}

function gitShowJson(ref, path) {
  if (!ref || /^0+$/.test(ref)) return null;
  const result = spawnSync("git", ["show", `${ref}:${path}`], { encoding: "utf8" });
  if (result.status !== 0) return null;
  return JSON.parse(result.stdout);
}

function parseVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/.exec(version);
  if (!match) throw new Error(`Invalid release version: ${version}`);

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    label: match[4]?.split(".")[0] ?? "",
  };
}

function releaseTrainChangeAffectsAllPackages(base, head) {
  const previous = gitShowJson(base, "std/release.json");
  if (!previous?.nextVersion) return true;

  const current = JSON.parse(readFileSync("std/release.json", "utf8"));
  const previousVersion = parseVersion(previous.nextVersion);
  const currentVersion = parseVersion(current.nextVersion);

  return (
    previousVersion.major !== currentVersion.major ||
    previousVersion.minor !== currentVersion.minor ||
    previousVersion.label !== currentVersion.label
  );
}

function allPackages(manifests) {
  return new Set(manifests.keys());
}

function addDependants(selected, manifests) {
  let changed = true;
  while (changed) {
    changed = false;
    for (const [candidateDir, candidateManifest] of manifests) {
      const deps = {
        ...candidateManifest.dependencies,
        ...candidateManifest.devDependencies,
        ...candidateManifest.peerDependencies,
        ...candidateManifest.optionalDependencies,
      };

      for (const selectedDir of selected) {
        const selectedName = manifests.get(selectedDir)?.name;
        if (selectedName && deps[selectedName] && !selected.has(candidateDir)) {
          selected.add(candidateDir);
          changed = true;
        }
      }
    }
  }
}

function selectForCi(args, manifests) {
  const eventName = args["event-name"] || process.env.EVENT_NAME;
  if (eventName === "schedule" || eventName === "workflow_dispatch") return allPackages(manifests);

  const files =
    eventName === "pull_request"
      ? (gitDiffFiles(
          args["base-sha"] || process.env.BASE_SHA,
          args["head-sha"] || process.env.HEAD_SHA,
        ) ?? gitDiffFiles("HEAD^1", "HEAD"))
      : gitDiffFiles(
          args["before-sha"] || process.env.BEFORE_SHA,
          args["head-sha"] || process.env.HEAD_SHA,
        );

  if (files === null) return allPackages(manifests);
  if (
    files.some((file) =>
      /^(eng\/scripts\/|package\.json$|pnpm-lock\.yaml$|pnpm-workspace\.yaml$|vite\.config\.ts$)/.test(
        file,
      ),
    )
  ) {
    return allPackages(manifests);
  }

  if (
    files.includes("std/release.json") &&
    releaseTrainChangeAffectsAllPackages(
      eventName === "pull_request"
        ? args["base-sha"] || process.env.BASE_SHA
        : args["before-sha"] || process.env.BEFORE_SHA,
      args["head-sha"] || process.env.HEAD_SHA,
    )
  ) {
    return allPackages(manifests);
  }

  const selected = new Set();
  for (const file of files) {
    const match = /^std\/([^/]+)\//.exec(file);
    if (match) selected.add(`std/${match[1]}`);
  }
  addDependants(selected, manifests);
  return selected;
}

function selectForRelease(args, manifests) {
  const inputPackage = args.package || process.env.INPUT_PACKAGE || "";
  const refName = args["ref-name"] || process.env.REF_NAME || "";

  if (refName.startsWith("std/v")) return allPackages(manifests);

  if (inputPackage && inputPackage !== "all") return new Set([inputPackage.replace(/\\/g, "/")]);

  return allPackages(manifests);
}

function validateSelected(selected, manifests) {
  for (const dir of selected) {
    if (!/^std\/[A-Za-z0-9._-]+$/.test(dir) || !manifests.has(dir)) {
      throw new Error(`Invalid std package: ${dir}`);
    }
  }
  return sortPackagesByDependencies(
    [...selected].filter((dir) => manifests.has(dir)),
    manifests,
  );
}

function sortPackagesByDependencies(packages, manifests) {
  const packageSet = new Set(packages);
  const nameToDir = new Map([...manifests].map(([dir, manifest]) => [manifest.name, dir]));
  const sorted = [];
  const visiting = new Set();
  const visited = new Set();

  function visit(dir) {
    if (visited.has(dir)) return;
    if (visiting.has(dir)) throw new Error(`Cycle detected in std package dependencies at ${dir}.`);
    visiting.add(dir);

    const manifest = manifests.get(dir);
    const deps = {
      ...manifest.dependencies,
      ...manifest.peerDependencies,
    };
    for (const name of Object.keys(deps)) {
      const dependencyDir = nameToDir.get(name);
      if (dependencyDir && packageSet.has(dependencyDir)) visit(dependencyDir);
    }

    visiting.delete(dir);
    visited.add(dir);
    sorted.push(dir);
  }

  for (const dir of packages.sort()) visit(dir);
  return sorted;
}

const args = parseArgs(process.argv.slice(2));
const mode = args.mode || "ci";
const manifests = readStdPackages();
const selected =
  mode === "release" ? selectForRelease(args, manifests) : selectForCi(args, manifests);
const packages = validateSelected(selected, manifests);

const value = packages.join(" ");
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `packages=${value}\n`);

if (packages.length === 0) {
  console.log("No std packages selected.");
} else {
  console.log(`Selected std packages: ${packages.join(", ")}`);
}
