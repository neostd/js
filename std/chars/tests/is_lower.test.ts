import { test } from "node:test";
import assert from "node:assert/strict";
import { isLower, isLowerAt } from "../src/is_lower.ts";

test("chars::isLower", (): void => {
  assert.ok(isLower(97)); // a
  assert.ok(isLower(98)); // b
  assert.ok(isLower(99)); // c
  assert.ok(isLower(122)); // z

  assert.ok(!isLower(65)); // A
  assert.ok(!isLower(90)); // Z
  assert.ok(!isLower(48)); // 0
  assert.ok(!isLower(57)); // 9

  assert.ok(!isLower(0xa64e)); // Ꙏ
  assert.ok(isLower(0xa64f)); // ꙏ
});

test("chars::isLowerAt", (): void => {
  const str = "Holy 💩ꙏ";
  assert.ok(!isLowerAt(str, 0));
  assert.ok(isLowerAt(str, 1));
  assert.ok(isLowerAt(str, 2));
  assert.ok(isLowerAt(str, 3));
  assert.ok(!isLowerAt(str, 4));
  assert.ok(!isLowerAt(str, 5));
  assert.ok(!isLowerAt(str, 6));
  assert.ok(isLowerAt(str, 7));
});
