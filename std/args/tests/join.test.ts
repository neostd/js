import { strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { join, unixJoin, windowsJoin } from "../src/join.ts";

test("args::windowsJoin joins simple args", () => {
  strictEqual(windowsJoin(["foo", "bar", "baz"]), "foo bar baz");
});

test("args::windowsJoin quotes spaces and escapes quotes", () => {
  strictEqual(windowsJoin(["foo", "bar baz"]), 'foo "bar baz"');
  strictEqual(windowsJoin(["foo", 'bar"baz']), 'foo "bar\\"baz"');
});

test("args::unixJoin joins and escapes shell-special characters", () => {
  strictEqual(unixJoin(["echo", "$HOME"]), 'echo "\\$HOME"');
  strictEqual(unixJoin(["echo", "hello world"]), 'echo "hello world"');
});

test("args::join uses current platform", () => {
  strictEqual(join(["echo", "hello", "world"]), "echo hello world");
});
