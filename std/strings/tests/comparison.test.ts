import { strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { endsWith, endsWithFold } from "../src/ends-with.ts";
import { equal, equalFold } from "../src/equal.ts";
import { indexOf, indexOfFold } from "../src/index-of.ts";
import { lastIndexOf, lastIndexOfFold } from "../src/last-index-of.ts";
import { startsWith, startsWithFold } from "../src/starts-with.ts";

test("strings::equal compares strings", () => {
  strictEqual(equal("Hello", "Hello"), true);
  strictEqual(equal("Hello", "hello"), false);
  strictEqual(equal("日本語", "日本語"), true);
  strictEqual(equalFold("hello WÖrLD", "Hello wörld"), true);
  strictEqual(equalFold("Hello", "Hell"), false);
});

test("strings::startsWith checks prefixes", () => {
  strictEqual(startsWith("Hello World", "Hello"), true);
  strictEqual(startsWith("Hello", ""), true);
  strictEqual(startsWith("Hello", "Hello"), true);
  strictEqual(startsWith("Hello World", "hello"), false);
  strictEqual(startsWith("Hi", "Hello"), false);
  strictEqual(startsWithFold("Wörld", "WÖRLD"), true);
  strictEqual(startsWithFold("Hello World", "World"), false);
});

test("strings::endsWith checks suffixes", () => {
  strictEqual(endsWith("Hello World", "World"), true);
  strictEqual(endsWith("Hello", ""), true);
  strictEqual(endsWith("Hello", "Hello"), true);
  strictEqual(endsWith("Hello World", "world"), false);
  strictEqual(endsWith("Hi", "Hello"), false);
  strictEqual(endsWithFold("Hello Wörld", "WÖRLD"), true);
  strictEqual(endsWithFold("Hello World", "Hello"), false);
});

test("strings::indexOf finds first occurrences", () => {
  strictEqual(indexOf("Hello World", "Hello"), 0);
  strictEqual(indexOf("Hello World", "World"), 6);
  strictEqual(indexOf("Hello Hello", "Hello", 1), 6);
  strictEqual(indexOf("Hello", ""), -1);
  strictEqual(indexOf("Hi", "Hello"), -1);
  strictEqual(indexOfFold("Hello Wörld", "WÖRLD"), 6);
});

test("strings::lastIndexOf finds last occurrences", () => {
  strictEqual(lastIndexOf("hello world", "o"), 7);
  strictEqual(lastIndexOf("hello world", "o", 6), 4);
  strictEqual(lastIndexOf("hello world", "z"), -1);
  strictEqual(lastIndexOfFold("Hello WORLD", "O"), 7);
  strictEqual(lastIndexOfFold("hello HELLO", "L", 5), 3);
});
