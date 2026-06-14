import { deepStrictEqual, equal } from "node:assert/strict";
import { test } from "node:test";
import * as fmt from "../src/index.ts";

test("fmt::index exports the public API", () => {
  deepStrictEqual(Object.keys(fmt).sort(), [
    "echo",
    "echof",
    "errorf",
    "inspect",
    "print",
    "printf",
    "setNoColor",
    "sprintf",
  ]);
  equal(typeof fmt.sprintf, "function");
});
