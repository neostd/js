import { deepStrictEqual } from "node:assert/strict";
import { test } from "node:test";
import { split } from "../src/split.ts";

test("args::split handles simple args", () => {
  deepStrictEqual(split("deno run --allow-read mod.ts"), ["deno", "run", "--allow-read", "mod.ts"]);
});

test("args::split handles quoted args", () => {
  deepStrictEqual(split('ls -la "my documents"'), ["ls", "-la", "my documents"]);
  deepStrictEqual(split("grep 'hello world' file.txt"), ["grep", "hello world", "file.txt"]);
});

test("args::split handles escaped quotes", () => {
  deepStrictEqual(split('echo "say \\"hello\\""'), ["echo", 'say "hello"']);
});

test("args::split handles empty and whitespace", () => {
  deepStrictEqual(split(""), []);
  deepStrictEqual(split("     "), []);
});
