import { test } from "node:test";
import assert from "node:assert/strict";
import { equalFold, simpleFold } from "../src/simple-fold.ts";

test("chars::simpleFold", (): void => {
  assert.equal(simpleFold(0x0041), 0x0061);
  assert.equal(simpleFold(0x0061), 0x0041);
  assert.equal(simpleFold(0x00b5), 0x039c);
  assert.equal(simpleFold(0x039c), 0x03bc);
  assert.equal(simpleFold(0x03bc), 0x00b5);
  assert.equal(simpleFold(0x1f600), 0x1f600);
  assert.equal(simpleFold(0x1f600), 0x1f600);
  assert.equal(simpleFold(0x1f600), 0x1f600);
  assert.equal(simpleFold(0x1f600), 0x1f600);
  assert.equal(simpleFold(0x1f600), 0x1f600);
  assert.equal(simpleFold(0x1f600), 0x1f600);
  assert.equal(simpleFold(0x1f600), 0x1f600);
  assert.equal(simpleFold(0x1f600), 0x1f600);
  assert.equal(simpleFold(0x1f600), 0x1f600);
  assert.equal(simpleFold(0x1f600), 0x1f600);
  assert.equal(simpleFold(0x1f600), 0x1f600);
});

test("chars::equalFold", (): void => {
  assert.ok(equalFold(0x0041, 0x0061));
  assert.ok(equalFold(0x0061, 0x0041));
  assert.ok(equalFold(0x00b5, 0x039c));
  assert.ok(equalFold(0x039c, 0x03bc));
  assert.ok(equalFold(0x03bc, 0x00b5));
});
