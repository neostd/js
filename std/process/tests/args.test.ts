import { deepStrictEqual, fail, strictEqual } from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { args } from "../src/args.ts";
import { bun, hasBun, node } from "./runtime.ts";

const helper = fileURLToPath(new URL("./internal/args.ts", import.meta.url));
const expected = ["arg1", "arg2", "--option", "value", "-o"];

test("process::args excludes executable and script path", () => {
  strictEqual(Array.isArray(args), true);
});

test("process::args in node child process", () => {
  const result = spawnSync(node, [helper, ...expected], { encoding: "utf8", stdio: "pipe" });
  if (result.status !== 0) {
    fail(`node run failed ${result.stdout} ${result.stderr}`);
  }

  deepStrictEqual(JSON.parse(result.stdout), expected);
});

test("process::args in bun child process", { skip: !hasBun }, () => {
  const result = spawnSync(bun, [helper, ...expected], { encoding: "utf8", stdio: "pipe" });
  if (result.status !== 0) {
    fail(`bun run failed ${result.stdout} ${result.stderr}`);
  }

  deepStrictEqual(JSON.parse(result.stdout), expected);
});
