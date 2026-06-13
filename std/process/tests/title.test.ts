import { strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { title } from "../src/title.ts";

test("process::title gets and sets the process title", () => {
  const original = title.get();
  const next = `${original}-neostd-test`;

  strictEqual(title.isSupported(), true);
  title.set(next);
  strictEqual(title.get(), next);

  title.set(original);
  strictEqual(title.get(), original);
});
