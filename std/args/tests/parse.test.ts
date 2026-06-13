import { deepStrictEqual, strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { parse } from "../src/parse.ts";

test("args::parse parses long flags, values, and positionals", () => {
  deepStrictEqual(parse(["--name", "neo", "--count=2", "-v", "input.txt"], { boolean: ["v"] }), {
    _: ["input.txt"],
    count: 2,
    name: "neo",
    v: true,
  });
});

test("args::parse supports aliases and defaults", () => {
  deepStrictEqual(parse(["-n", "neo"], { alias: { name: "n" }, default: { color: "blue" } }), {
    _: [],
    color: "blue",
    n: "neo",
    name: "neo",
  });
});

test("args::parse supports booleans, no flags, and repeated values", () => {
  deepStrictEqual(
    parse(["--watch", "--no-color", "--tag", "a", "--tag", "b"], { boolean: ["watch"] }),
    {
      _: [],
      color: false,
      tag: ["a", "b"],
      watch: true,
    },
  );
});

test("args::parse preserves strings and stores -- tail", () => {
  deepStrictEqual(parse(["--id", "001", "--", "--not-parsed"], { "--": true, string: ["id"] }), {
    "--": ["--not-parsed"],
    _: [],
    id: "001",
  });
});

test("args::parse defaults to current runtime args", () => {
  const parsed = parse();
  strictEqual(Array.isArray(parsed._), true);
});
