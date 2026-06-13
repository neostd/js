import { ok, strictEqual } from "node:assert/strict";
import { dirname } from "node:path";
import { test } from "node:test";
import { chdir } from "../src/chdir.ts";
import { cwd } from "../src/cwd.ts";

test("process::cwd returns a string", () => {
  strictEqual(typeof cwd(), "string");
});

test("process::cwd returns non-empty string", () => {
  ok(cwd().length > 0);
});

test("process::cwd returns absolute path", () => {
  const dir = cwd();
  ok(dir.startsWith("/") || /^[A-Za-z]:[\\/]/.test(dir), `Expected absolute path but got: ${dir}`);
});

test("process::cwd is consistent on repeated calls", () => {
  strictEqual(cwd(), cwd());
});

test("process::cwd reflects chdir changes", () => {
  const original = cwd();
  const parent = dirname(original);

  chdir(parent);
  strictEqual(cwd(), parent);

  chdir(original);
  strictEqual(cwd(), original);
});

test("process::cwd handles relative path changes", () => {
  const original = cwd();

  chdir("..");
  const parent = cwd();
  ok(parent !== original || original === "/");

  chdir(original);
});

test("process::cwd handles current directory reference", () => {
  const original = cwd();
  chdir(".");
  strictEqual(cwd(), original);
});
