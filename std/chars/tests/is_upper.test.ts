import { test } from "node:test";
import assert from "node:assert/strict";
import { isUpper, isUpperAt } from "../src/is_upper.ts";

test("chars::isUpper", (): void => {
  assert.ok(!isUpper(97)); // a
  assert.ok(!isUpper(98)); // b
  assert.ok(!isUpper(99)); // c
  assert.ok(!isUpper(122)); // z

  assert.ok(isUpper(65)); // A
  assert.ok(isUpper(90)); // Z
  assert.ok(!isUpper(48)); // 0
  assert.ok(!isUpper(57)); // 9

  assert.ok(isUpper(0xa64e)); // Ꙏ
  assert.ok(!isUpper(0xa64f)); // ꙏ
});

test("chars::isUpperAt", (): void => {
  const str = "Holy 💩Ꙏ";
  assert.ok(isUpperAt(str, 0));
  assert.ok(!isUpperAt(str, 1));
  assert.ok(!isUpperAt(str, 2));
  assert.ok(!isUpperAt(str, 3));
  assert.ok(!isUpperAt(str, 4));
  assert.ok(!isUpperAt(str, 5));
  assert.ok(!isUpperAt(str, 6));
  assert.ok(isUpperAt(str, 7));
});
