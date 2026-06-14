import { equal } from "node:assert/strict";
import { test } from "node:test";
import { stripAnsiCode } from "../src/strip_ansi_code.ts";

test("fmt::stripAnsiCode removes ANSI escapes", () => {
  equal(stripAnsiCode("\x1b[31mHello\x1b[0m"), "Hello");
});
