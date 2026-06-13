import { test } from "node:test";
import assert from "node:assert/strict";
import { isAscii, isAsciiAt } from "../src/is-ascii.ts";

test("chars::isAscii", (): void => {
  assert.ok(isAscii(65));
  assert.ok(isAscii(0));
  assert.ok(isAscii(127));
  assert.ok(!isAscii(128));
  assert.ok(!isAscii(255));
  assert.ok(!isAscii(256));
  assert.ok(!isAscii(-1));
  assert.ok(!isAscii(-128));
  assert.ok(!isAscii(-255));
  assert.ok(!isAscii(-256));
  assert.ok(!isAscii(Infinity));
  assert.ok(!isAscii(-Infinity));
  assert.ok(!isAscii(NaN));
  assert.ok(!isAscii(0.1));
  assert.ok(!isAscii(-0.1));
  assert.ok(!isAscii(0.9));
  assert.ok(!isAscii(-0.9));
  assert.ok(!isAscii(1.1));
  assert.ok(!isAscii(-1.1));
  assert.ok(!isAscii(1.9));
  assert.ok(!isAscii(-1.9));
  assert.ok(isAscii(1.0));
  assert.ok(!isAscii(-1.0));
  assert.ok(isAscii(0.0));
  assert.ok(isAscii(-0.0));
  assert.ok(!isAscii(0.0000000000001));
  assert.ok(!isAscii(-0.0000000000001));
  assert.ok(!isAscii(0.0000000000009));
  assert.ok(!isAscii(-0.0000000000009));
  assert.ok(!isAscii(0.0000000000011));
  assert.ok(!isAscii(-0.0000000000011));
  assert.ok(!isAscii(0.0000000000019));
  assert.ok(!isAscii(-0.0000000000019));
  assert.ok(isAscii(0.0));
  assert.ok(isAscii(-0.0));
});

test("chars::isAsciiAt", (): void => {
  const str = "Holy 💩";

  assert.ok(isAsciiAt(str, 0));
  assert.ok(isAsciiAt(str, 1));
  assert.ok(isAsciiAt(str, 2));
  assert.ok(isAsciiAt(str, 3));
  assert.ok(isAsciiAt(str, 4));
  assert.ok(!isAsciiAt(str, 5));
});
