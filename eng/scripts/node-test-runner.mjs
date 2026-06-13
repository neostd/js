import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export class NodeTestRunner {
  constructor(config) {
    this.config = config;
  }

  importFile(filepath, _source) {
    return this.moduleRunner?.import(filepath) ?? import(pathToFileURL(filepath).href);
  }
}

export async function runNodeTests(cwd = process.cwd(), testDir = "tests") {
  console.log("Running tests in", testDir);
  const absTestDir = resolve(cwd, testDir);
  const files = (await readdir(absTestDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".test.ts"))
    .map((entry) => `${testDir}/${entry.name}`)
    .sort();

  const result = spawnSync(process.execPath, ["--test", ...files], {
    cwd,
    stdio: "inherit",
  });

  return result.status ?? 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const code = await runNodeTests();
  process.exit(code);
}

export default NodeTestRunner;
