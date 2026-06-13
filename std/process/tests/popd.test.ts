import { ok, strictEqual } from "node:assert/strict";
import { test } from "node:test";
import { chdir } from "../src/chdir.ts";
import { cwd } from "../src/cwd.ts";
import { history } from "../src/history.ts";
import { popd } from "../src/popd.ts";
import { pushd } from "../src/pushd.ts";

function clearHistory() {
  history.splice(0, history.length);
}

test("process::pushd adds to history and changes directory", () => {
  const original = cwd();

  pushd("..");
  ok(history.length > 0);

  popd();
  chdir(original);
});

test("process::popd returns undefined on empty history", () => {
  clearHistory();
  strictEqual(popd(), undefined);
});

test("process::pushd and popd work together", () => {
  const original = cwd();
  clearHistory();

  pushd("..");
  const directory = popd();
  ok(directory);
  strictEqual(directory, "..");

  chdir(original);
});

test("process::pushd maintains LIFO order", () => {
  const original = cwd();
  clearHistory();

  pushd("..");
  pushd(".");

  strictEqual(popd(), ".");
  strictEqual(popd(), "..");

  chdir(original);
});

test("process::multiple pushd increases history length", () => {
  clearHistory();
  const initialLength = history.length;

  pushd(".");
  pushd(".");
  pushd(".");

  strictEqual(history.length, initialLength + 3);

  popd();
  popd();
  popd();
});

test("process::popd on empty stack returns undefined", () => {
  clearHistory();
  strictEqual(popd(), undefined);
  strictEqual(popd(), undefined);
});

test("process::pushd with current directory", () => {
  const original = cwd();

  pushd(".");
  strictEqual(popd(), ".");

  chdir(original);
});
