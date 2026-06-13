import { deepStrictEqual } from "node:assert/strict";
import { test } from "node:test";
import * as path from "../src/index.ts";
import * as posix from "../src/posix/index.ts";
import * as windows from "../src/windows/index.ts";

const expectedExports = [
  "DELIMITER",
  "SEPARATOR",
  "SEPARATOR_PATTERN",
  "basename",
  "common",
  "dirname",
  "extname",
  "format",
  "fromFileUrl",
  "globToRegExp",
  "isAbsolute",
  "isGlob",
  "join",
  "joinGlobs",
  "normalize",
  "normalizeGlob",
  "parse",
  "relative",
  "resolve",
  "toFileUrl",
  "toNamespacedPath",
];

test("path::index exports the public API", () => {
  deepStrictEqual(Object.keys(path).sort(), expectedExports);
});

test("path::posix exports the public API", () => {
  deepStrictEqual(Object.keys(posix).sort(), expectedExports);
});

test("path::windows exports the public API", () => {
  deepStrictEqual(Object.keys(windows).sort(), expectedExports);
});
