import { test } from "node:test";
import assert from "node:assert/strict";
import { isDigit, isDigitAt } from "../src/is-digit.ts";

test("chars::isDigit", (): void => {
  assert.ok(isDigit(48)); // 0
  assert.ok(isDigit(49)); // 1
  assert.ok(isDigit(50)); // 2
  assert.ok(isDigit(51)); // 3

  assert.ok(!isDigit(1)); // \x01
  assert.ok(isDigit(0x0e50)); // ๐
  assert.ok(isDigit(0x0e51)); // ๑
  assert.ok(isDigit(0x0e52)); // ๒
});

test("chars::isDigitAt", (): void => {
  const str = "Hello 123!";
  assert.ok(!isDigitAt(str, 0));
  assert.ok(!isDigitAt(str, 1));
  assert.ok(isDigitAt(str, 6));

  const str2 = "๐ ๑ ๒ ๓ ๔ ๕ ๖ ๗ ๘ ๙";
  assert.ok(isDigitAt(str2, 0));
  assert.ok(!isDigitAt(str2, 1));
  assert.ok(isDigitAt(str2, 2));
  assert.ok(isDigitAt(str2, 4));
});
