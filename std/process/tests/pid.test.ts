import { ok, strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { NODELIKE } from "../src/globals.ts";
import { pid } from "../src/pid.ts";

test("process::pid is a number", () => {
  strictEqual(typeof pid, "number");
});

test("process::pid is positive in runtime environments", () => {
  if (NODELIKE) {
    ok(pid > 0, `Expected positive pid but got ${pid}`);
  } else {
    strictEqual(pid, 0);
  }
});

test("process::pid is an integer", () => {
  ok(Number.isInteger(pid), `Expected integer pid but got ${pid}`);
});

test("process::pid is consistent across reads", () => {
  strictEqual(pid, pid);
});

test("process::pid is finite", () => {
  ok(Number.isFinite(pid), "pid should be finite");
});
