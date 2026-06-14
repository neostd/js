import { equal, throws } from "node:assert/strict";
import { test } from "node:test";
import { sprintf } from "../src/printf.ts";

test("fmt::sprintf handles basics", () => {
  equal(sprintf("%%"), "%");
  equal(sprintf("%s", "hello"), "hello");
  equal(sprintf("%d", 42), "42");
  equal(sprintf("%x", "123"), "313233");
  equal(sprintf("%x", 255), "ff");
  equal(sprintf("%I", { a: 1 }).length > 0, true);
});

test("fmt::sprintf rejects invalid hex values", () => {
  throws(() => sprintf("%x", {}));
});
