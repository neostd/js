import { ok } from "node:assert/strict";
import { test } from "node:test";
import { inspect } from "../src/inspect.ts";

test("fmt::inspect returns a string", () => {
  const value = inspect({ a: 1 });
  ok(typeof value === "string");
  ok(value.includes("a"));
  ok(value.includes("1"));
});
