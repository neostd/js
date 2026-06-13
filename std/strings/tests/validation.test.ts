import { strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { isEmpty, isNullOrEmpty } from "../src/is-empty.ts";
import { isNull } from "../src/is-null.ts";
import { isNullOrSpace, isSpace } from "../src/is-space.ts";
import { isUndefined } from "../src/is-undefined.ts";

test("strings::isEmpty and isNullOrEmpty classify empty values", () => {
  strictEqual(isEmpty(""), true);
  strictEqual(isEmpty("test"), false);
  strictEqual(isNullOrEmpty(null), true);
  strictEqual(isNullOrEmpty(undefined), true);
  strictEqual(isNullOrEmpty(""), true);
  strictEqual(isNullOrEmpty("test"), false);
});

test("strings::isNull only matches null", () => {
  strictEqual(isNull(null), true);
  strictEqual(isNull(""), false);
  strictEqual(isNull("test"), false);
});

test("strings::isSpace and isNullOrSpace classify whitespace", () => {
  strictEqual(isSpace(" \t\n\r"), true);
  strictEqual(isSpace(" a "), false);
  strictEqual(isNullOrSpace(null), true);
  strictEqual(isNullOrSpace(undefined), true);
  strictEqual(isNullOrSpace(""), true);
  strictEqual(isNullOrSpace(" \t\n\r"), true);
  strictEqual(isNullOrSpace("abc"), false);
});

test("strings::isUndefined only matches undefined", () => {
  strictEqual(isUndefined(undefined), true);
  strictEqual(isUndefined(""), false);
  strictEqual(isUndefined("test"), false);
});
