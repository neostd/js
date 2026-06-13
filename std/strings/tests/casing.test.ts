import { deepStrictEqual, strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { camelize } from "../src/camelize.ts";
import { capitalize } from "../src/capitalize.ts";
import { dasherize } from "../src/dasherize.ts";
import { pascalize } from "../src/pascalize.ts";
import { titleize } from "../src/titleize.ts";
import { underscore } from "../src/underscore.ts";

test("strings::camelize converts common separators", () => {
  strictEqual(camelize("hello world"), "helloWorld");
  strictEqual(camelize("HelloWorld"), "helloWorld");
  strictEqual(camelize("hello_world"), "helloWorld");
  strictEqual(camelize("hello-world"), "helloWorld");
  strictEqual(camelize("hello wöRLd", { preserveCase: true }), "hellowöRLd");
});

test("strings::capitalize capitalizes and lowercases the rest", () => {
  strictEqual(capitalize("hello"), "Hello");
  strictEqual(capitalize("HELLoWorld"), "Helloworld");
  strictEqual(capitalize("Bob The OG"), "Bob the og");
  strictEqual(capitalize("über"), "Über");
});

test("strings::dasherize converts to kebab case", () => {
  strictEqual(dasherize("hello_world"), "hello-world");
  strictEqual(dasherize("helloWorld"), "hello-world");
  strictEqual(dasherize("HelloWorld_Test"), "hello-world-test");
  strictEqual(dasherize("helloWörld"), "hello-wörld");
});

test("strings::pascalize converts to PascalCase", () => {
  strictEqual(pascalize("hello world"), "HelloWorld");
  strictEqual(pascalize("hello_world-test"), "HelloWorldTest");
  strictEqual(pascalize("hello WÖrLD"), "HelloWörld");
  strictEqual(pascalize(""), "");
});

test("strings::titleize converts to title case", () => {
  strictEqual(titleize("hello_world"), "Hello World");
  strictEqual(titleize("HELLo-World"), "Hello World");
  strictEqual(titleize("BobTheOG"), "Bob the Og");
  strictEqual(titleize("café_au_lait"), "Café Au Lait");
});

test("strings::underscore converts to snake case", () => {
  strictEqual(underscore("HelloWorld"), "hello_world");
  strictEqual(underscore("hello-World"), "hello_world");
  strictEqual(underscore("hello   world"), "hello_world");
  strictEqual(underscore("helloWörld", { screaming: true }), "HELLO_WÖRLD");
});

test("strings::case functions handle empty strings", () => {
  deepStrictEqual(
    [camelize(""), capitalize(""), dasherize(""), pascalize(""), titleize(""), underscore("")],
    ["", "", "", "", "", ""],
  );
});
