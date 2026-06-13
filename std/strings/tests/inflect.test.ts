import { strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { inflect, pluralize, singularize } from "../src/inflect.ts";

test("strings::pluralize handles regular, irregular, and uncountable words", () => {
  strictEqual(pluralize("accommodation"), "accommodation");
  strictEqual(pluralize("woman"), "women");
  strictEqual(pluralize("person"), "people");
  strictEqual(pluralize("octopus"), "octopuses");
  strictEqual(pluralize("life"), "lives");
  strictEqual(pluralize("foot"), "feet");
  strictEqual(pluralize("goose"), "geese");
  strictEqual(pluralize("knife"), "knives");
  strictEqual(pluralize("index"), "indices");
  strictEqual(pluralize("criterion"), "criteria");
  strictEqual(pluralize("database"), "databases");
});

test("strings::singularize handles regular, irregular, and already singular words", () => {
  strictEqual(singularize("status"), "status");
  strictEqual(singularize("children"), "child");
  strictEqual(singularize("women"), "woman");
  strictEqual(singularize("people"), "person");
  strictEqual(singularize("movies"), "movie");
  strictEqual(singularize("octopuses"), "octopus");
  strictEqual(singularize("lives"), "life");
  strictEqual(singularize("teeth"), "tooth");
  strictEqual(singularize("matrices"), "matrix");
  strictEqual(singularize("criteria"), "criterion");
  strictEqual(singularize("databases"), "database");
});

test("strings::inflect chooses singular or plural by count", () => {
  strictEqual(inflect("people", 1), "person");
  strictEqual(inflect("person", 2), "people");
  strictEqual(inflect("person", Number.NaN), "person");
});

test("strings::inflect functions support override outputs", () => {
  strictEqual(pluralize("person", "folks"), "folks");
  strictEqual(singularize("people", "human"), "human");
  strictEqual(inflect("person", 1, "human", "folks"), "human");
  strictEqual(inflect("person", 2, "human", "folks"), "folks");
});
