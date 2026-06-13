import { fail } from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { bun, hasBun, node } from "./runtime.ts";

const exit0 = fileURLToPath(new URL("./internal/exit-0.ts", import.meta.url));
const exit1 = fileURLToPath(new URL("./internal/exit-1.ts", import.meta.url));

test("process::exit 0 in node child process", () => {
  const result = spawnSync(node, [exit0], { encoding: "utf8", stdio: "pipe" });
  if (result.status !== 0) {
    fail(`exit-0.ts run failed exit code ${result.status}`);
  }
});

test("process::exit 1 in node child process", () => {
  const result = spawnSync(node, [exit1], { encoding: "utf8", stdio: "pipe" });
  if (result.status !== 1) {
    fail(`exit-1.ts run failed exit code ${result.status}`);
  }
});

test("process::exit 0 in bun child process", { skip: !hasBun }, () => {
  const result = spawnSync(bun, [exit0], { encoding: "utf8", stdio: "pipe" });
  if (result.status !== 0) {
    fail(`exit-0.ts bun run failed exit code ${result.status}`);
  }
});

test("process::exit 1 in bun child process", { skip: !hasBun }, () => {
  const result = spawnSync(bun, [exit1], { encoding: "utf8", stdio: "pipe" });
  if (result.status !== 1) {
    fail(`exit-1.ts bun run failed exit code ${result.status}`);
  }
});
