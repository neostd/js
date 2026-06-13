import { deepStrictEqual, strictEqual, ok } from "node:assert/strict";
import { test } from "node:test";
import { CharArrayBuilder } from "@neostd/slices/char-array-builder";
import { split } from "../src/split.ts";
import { StringBuilder } from "../src/string-builder.ts";
import { toCharArray, toString } from "../src/to-char-array.ts";
import {
  trim,
  trimChar,
  trimEnd,
  trimEndChar,
  trimEndSlice,
  trimSlice,
  trimStart,
  trimStartChar,
  trimStartSlice,
} from "../src/trim.ts";

test("strings::split supports strings, arrays, trim, and limit", () => {
  deepStrictEqual(split("a,b,c", ","), ["a", "b", "c"]);
  deepStrictEqual(split("a,b;c", /[,;]/), ["a", "b", "c"]);
  deepStrictEqual(split(new TextEncoder().encode("a,b,c"), ","), ["a", "b", "c"]);
  deepStrictEqual(split(new Uint32Array([97, 44, 98, 44, 99]), ","), ["a", "b", "c"]);
  deepStrictEqual(split(" a , b , c , ", ",", true), ["a", "b", "c"]);
  deepStrictEqual(split("a,b,c,d", ",", false, 2), ["a", "b"]);
  deepStrictEqual(split(" a , b , c , d ", ",", true, 2), ["a", "b"]);
});

test("strings::StringBuilder builds strings", () => {
  const builder = new StringBuilder();
  ok(builder instanceof CharArrayBuilder);
  strictEqual(builder.length, 0);
  strictEqual(builder.toString(), "");

  builder.append("hello").append(" ").append("world");
  strictEqual(builder.length, 11);
  strictEqual(builder.toString(), "hello world");

  builder.clear();
  strictEqual(builder.length, 0);
  strictEqual(builder.toString(), "");
});

test("strings::toCharArray and toString convert strings and char arrays", () => {
  deepStrictEqual([...toCharArray("abc")], [97, 98, 99]);
  deepStrictEqual([...toCharArray("a😀")], [97, 128_512]);
  strictEqual(toString([97, 98, 99]), "abc");
  strictEqual(toString("abc"), "abc");
  strictEqual(toString(toCharArray("a😀")), "a😀");
});

test("strings::trim functions remove whitespace and custom chars", () => {
  strictEqual(trimEndChar("hello.", 46), "hello");
  strictEqual(trimEndSlice("hello123", [49, 50, 51]), "hello");
  strictEqual(trimEnd("hello   "), "hello");
  strictEqual(trimEnd("hello.", [46]), "hello");
  strictEqual(trimEnd("hello...", "."), "hello");
  strictEqual(trimStartChar(".hello", 46), "hello");
  strictEqual(trimStartSlice("123hello", [49, 50, 51]), "hello");
  strictEqual(trimStart("   hello"), "hello");
  strictEqual(trimStart(".hello", [46]), "hello");
  strictEqual(trimStart("///hello", "/"), "hello");
  strictEqual(trimChar(".hello.", 46), "hello");
  strictEqual(trimSlice("123hello123", [49, 50, 51]), "hello");
  strictEqual(trim("  hello  "), "hello");
  strictEqual(trim(".hello.", [46]), "hello");
  strictEqual(trim("##hello##", "#"), "hello");
  strictEqual(trim("123hello123", "123"), "hello");
});
