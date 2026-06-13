import { deepStrictEqual } from "node:assert/strict";
import { test } from "node:test";
import * as processModule from "../src/index.ts";

const expectedExports = [
  "ChangeDirectoryError",
  "args",
  "chdir",
  "cwd",
  "env",
  "execPath",
  "exit",
  "kill",
  "onChdir",
  "pid",
  "popd",
  "pushd",
  "stderr",
  "stdin",
  "stdout",
  "title",
];

test("process::index exports the public API", () => {
  deepStrictEqual(Object.keys(processModule).sort(), expectedExports);
});
