import { ok, strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { execPath } from "../src/exec-path.ts";

test("process::execPath returns current executable path", () => {
  const path = execPath();
  strictEqual(typeof path, "string");
  ok(path.length > 0);
});
