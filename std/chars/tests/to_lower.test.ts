import { test } from "node:test";
import assert from "node:assert/strict";
import { toLower } from "../src/to_lower.ts";

test("chars::toLower", (): void => {
  assert.equal(toLower(0x0041), 0x0061);
  assert.equal(toLower(0x0061), 0x0061);
  assert.equal(toLower(0x00b5), 0x00b5);
  assert.equal(toLower(0x039c), 0x03bc);
  assert.equal(toLower(0x03bc), 0x03bc);
  assert.equal(toLower(0x1f600), 0x1f600);
  assert.equal(toLower(0x1f600), 0x1f600);
  assert.equal(toLower(0x1f600), 0x1f600);
  assert.equal(toLower(0x1f600), 0x1f600);
  assert.equal(toLower(0x1f600), 0x1f600);
  assert.equal(toLower(0x1f600), 0x1f600);
  assert.equal(toLower(0x1f600), 0x1f600);
  assert.equal(toLower(0x1f600), 0x1f600);
  assert.equal(toLower(0x1f600), 0x1f600);
  assert.equal(toLower(0x1f600), 0x1f600);
  assert.equal(toLower(0x1f600), 0x1f600);
});
