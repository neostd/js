import { deepStrictEqual } from "node:assert/strict";
import { test } from "node:test";
import * as args from "../src/index.ts";

const expectedExports = [
  "SplatSymbols",
  "join",
  "parse",
  "splat",
  "split",
  "unixJoin",
  "windowsJoin",
];

test("args::index exports the public API", () => {
  deepStrictEqual(Object.keys(args).sort(), expectedExports);
});
