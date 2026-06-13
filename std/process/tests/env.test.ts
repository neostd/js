import { ok, strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { env } from "../src/env.ts";

const key = `NEOSTD_PROCESS_TEST_${process.pid}`;

test("process::env gets, sets, checks, snapshots, and deletes variables like process.env", () => {
  delete env[key];
  strictEqual(env[key], undefined);
  strictEqual(key in env, false);

  env[key] = "value";
  strictEqual(env[key], "value");
  strictEqual(key in env, true);
  strictEqual({ ...env }[key], "value");
  ok(Object.keys(env).includes(key));

  delete env[key];
  strictEqual(env[key], undefined);
  strictEqual(key in env, false);
});

test("process::env snapshots contain string values", () => {
  env[key] = "snapshot";
  const snapshot = { ...env };

  ok(Object.values(snapshot).every((value) => typeof value === "string"));
  strictEqual(snapshot[key], "snapshot");

  delete env[key];
});

test("process::env coerces assigned values to strings", () => {
  env[key] = undefined;
  strictEqual(env[key], "undefined");

  delete env[key];
});
