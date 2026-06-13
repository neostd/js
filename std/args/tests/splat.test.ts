import { deepStrictEqual } from "node:assert/strict";
import { test } from "node:test";
import { splat, type SplatOptions, SplatSymbols } from "../src/splat.ts";

test("args::splat converts booleans and values", () => {
  deepStrictEqual(splat({ version: true }), ["--version"]);
  deepStrictEqual(splat({ output: "file.txt" }), ["--output", "file.txt"]);
});

test("args::splat supports assign and short flags", () => {
  deepStrictEqual(splat({ foo: "bar", splat: { assign: "=" } as SplatOptions }), ["--foo=bar"]);
  deepStrictEqual(splat({ f: true }), ["-f"]);
});

test("args::splat supports command, positionals, and extra args", () => {
  deepStrictEqual(splat({ [SplatSymbols.command]: "git clone", depth: 1 }), [
    "git",
    "clone",
    "--depth",
    "1",
  ]);
  deepStrictEqual(splat({ "*": ["src", "dest"], recursive: true, "--": ["--verbose"] }), [
    "src",
    "dest",
    "--recursive",
    "--",
    "--verbose",
  ]);
});
