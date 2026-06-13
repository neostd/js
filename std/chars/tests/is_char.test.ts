import { test } from "node:test";
import assert from "node:assert/strict";
import { isChar } from "../src/is-char.ts";

test("chars::isChar", (): void => {
  assert.ok(isChar(0x1f600));
  assert.ok(!isChar(0x110000));
  assert.ok(isChar(0x10ffff));
  assert.ok(!isChar(0.32));
  assert.ok(isChar(0.0));
  assert.ok(isChar(-0.0));
  assert.ok(!isChar(0.0000000000001));
  assert.ok(isChar(1.0));
});
