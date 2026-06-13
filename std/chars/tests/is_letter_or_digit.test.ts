import { test } from "node:test";
import assert from "node:assert/strict";
import { isLetterOrDigit, isLetterOrDigitAt } from "../src/is-letter-or-digit.ts";

test("chars::isLetterOrDigit", (): void => {
  assert.ok(!isLetterOrDigit(0x10ffff));
  assert.ok(!isLetterOrDigit(0.32));
  assert.ok(isLetterOrDigit(48));
  assert.ok(isLetterOrDigit(65));
  assert.ok(isLetterOrDigit(97));
  assert.ok(!isLetterOrDigit(0));
  assert.ok(!isLetterOrDigit(31));
});

test("chars::isLetterOrDigitAt", (): void => {
  const str = "Hello 123!";
  assert.ok(isLetterOrDigitAt(str, 0));
  assert.ok(isLetterOrDigitAt(str, 1));
  assert.ok(!isLetterOrDigitAt(str, 5));
  assert.ok(isLetterOrDigitAt(str, 7));
});
