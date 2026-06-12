import { test } from "node:test";
import assert from "node:assert/strict";
import { isSymbol, isSymbolAt } from "../src/is_symbol.ts";

test("chars::isSymbol", (): void => {
  assert.ok(isSymbol(0x0024));
  assert.ok(isSymbol(0x002b));
  assert.ok(!isSymbol(0x110000));
  assert.ok(!isSymbol(0x10ffff));
  assert.ok(!isSymbol(0.32));
  assert.ok(!isSymbol(0.0));
  assert.ok(!isSymbol(-0.0));
  assert.ok(!isSymbol(0.0000000000001));
  assert.ok(!isSymbol(1.0));
});

test("chars::isSymbolAt", (): void => {
  const str = "$22.50";
  assert.ok(isSymbolAt(str, 0));
  assert.ok(!isSymbolAt(str, 1));

  const str2 = "🦄";
  assert.ok(!isSymbolAt(str2, 0));
});
