import { test } from "node:test";
import assert from "node:assert/strict";
import { toUpper } from "../src/to-upper.ts";

test("chars::toUpper", (): void => {
  assert.equal(toUpper(0x0041), 0x0041);
  assert.equal(toUpper(0x0061), 0x0041);
  assert.equal(toUpper(0x00b5), 0x039c);
  assert.equal(toUpper(0x039c), 0x039c);
  assert.equal(toUpper(0x03bc), 0x039c);
  assert.equal(toUpper(0x1f600), 0x1f600);
  assert.equal(toUpper(0x1f600), 0x1f600);
  assert.equal(toUpper(0x1f600), 0x1f600);
  assert.equal(toUpper(0x1f600), 0x1f600);
  assert.equal(toUpper(0x1f600), 0x1f600);
  assert.equal(toUpper(0x1f600), 0x1f600);
  assert.equal(toUpper(0x1f600), 0x1f600);
  assert.equal(toUpper(0x1f600), 0x1f600);
  assert.equal(toUpper(0x1f600), 0x1f600);
  assert.equal(toUpper(0x1f600), 0x1f600);
  assert.equal(toUpper(0x1f600), 0x1f600);
});
