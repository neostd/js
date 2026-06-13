// Copyright 2018-2025 the Deno authors. MIT license.

import { deepStrictEqual as equal, throws } from "node:assert/strict";
import { test } from "node:test";
import { assertPath } from "../src/common/assert-path.ts";

test("path::assertPath()", () => {
  equal(assertPath(""), undefined);
  equal(assertPath("foo"), undefined);
});

test("path::assertPath() throws", () => {
  throws(() => assertPath(undefined), TypeError, 'Path must be a string, received "undefined"');
});
