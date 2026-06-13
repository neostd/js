// Copyright 2018-2025 the Deno authors. MIT license.
import { test } from "node:test";
import { deepStrictEqual as equal } from "node:assert/strict";
import * as windows from "../src/windows/index.ts";
import * as posix from "../src/posix/index.ts";
import { normalize as windowsUnstableNormalize } from "../src/windows/normalize.ts";
import { normalize as posixUnstableNormalize } from "../src/posix/normalize.ts";

test(`path::normalize() returns "." if input is empty`, function () {
  equal(posix.normalize(""), ".");
  equal(windows.normalize(""), ".");
});

test("path::posix.normalize() normalizes posix specific paths", () => {
  equal(posix.normalize("/foo/bar//baz/asdf/quux/.."), "/foo/bar/baz/asdf");
  equal(posixUnstableNormalize(new URL("file:///foo/bar//baz/asdf/quux/..")), "/foo/bar/baz/asdf/");
});

test("path::windows.normalize() normalizes windows specific paths", () => {
  equal(windows.normalize("//server/share/dir/file.ext"), "\\\\server\\share\\dir\\file.ext");
  equal(windowsUnstableNormalize(new URL("file:///C:/foo/bar/../baz/quux")), "C:\\foo\\baz\\quux");
});
