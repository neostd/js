import { fail, strictEqual } from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { kill } from "../src/kill.ts";
import { bun, hasBun, node } from "./runtime.ts";

const helper = fileURLToPath(new URL("./internal/kill.ts", import.meta.url));

test("process::kill supports signal 0 for the current process", () => {
  strictEqual(kill(process.pid, 0), true);
});

test("process::kill in node child process", () => {
  const result = spawnSync(node, [helper], { encoding: "utf8", stdio: "pipe" });
  if (result.status !== 0) {
    fail(`node run failed ${result.stdout} ${result.stderr}`);
  }
});

test("process::kill in bun child process", { skip: !hasBun }, () => {
  const result = spawnSync(bun, [helper], { encoding: "utf8", stdio: "pipe" });
  if (result.status !== 0) {
    fail(`bun run failed ${result.stdout} ${result.stderr}`);
  }
});
