import { deepStrictEqual, equal } from "node:assert/strict";
import { test } from "node:test";
import * as env from "../src/index.ts";
import * as expandModule from "../src/expand.ts";
import * as exportModule from "../src/export.ts";

const expectedRootExports = [
  "appendPath",
  "expand",
  "get",
  "has",
  "hasPath",
  "home",
  "hostname",
  "joinPath",
  "merge",
  "os",
  "path",
  "prependPath",
  "proxy",
  "remove",
  "removePath",
  "replacePath",
  "set",
  "setPath",
  "shell",
  "splitPath",
  "toObject",
  "union",
  "user",
];

test("env::index exports the public API", () => {
  deepStrictEqual(Object.keys(env).sort(), expectedRootExports);
});

test("env::expand subpath exports expand", () => {
  deepStrictEqual(Object.keys(expandModule).sort(), ["expand", "expandAsync"]);
});

test("env::export subpath exports env namespace", () => {
  deepStrictEqual(Object.keys(exportModule), ["env"]);
  equal(exportModule.env.get, env.get);
});
