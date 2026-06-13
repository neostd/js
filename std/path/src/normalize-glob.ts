// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.

import type { GlobOptions } from "./common/glob-to-reg-exp.ts";
import { isWindows } from "./os.ts";
import { normalizeGlob as posixNormalizeGlob } from "./posix/normalize-glob.ts";
import { normalizeGlob as windowsNormalizeGlob } from "./windows/normalize-glob.ts";

export type { GlobOptions };

/**
 * Normalizes a glob string.
 *
 * Behaves like
 * {@linkcode https://jsr.io/@neostd/path/doc/~/normalize | normalize()}, but
 * doesn't collapse "**\/.." when `globstar` is true.
 *
 * @example Usage
 * ```ts
 * import { normalizeGlob } from "@neostd/path/normalize-glob";
 * import { equal } from "node:assert/strict";
 *
 * if (Deno.build.os === "windows") {
 *   equal(normalizeGlob("foo\\bar\\..\\baz"), "foo\\baz");
 *   equal(normalizeGlob("foo\\**\\..\\bar\\..\\baz", { globstar: true }), "foo\\**\\..\\baz");
 * } else {
 *   equal(normalizeGlob("foo/bar/../baz"), "foo/baz");
 *   equal(normalizeGlob("foo/**\/../bar/../baz", { globstar: true }), "foo/**\/../baz");
 * }
 * ```
 *
 * @param glob Glob string to normalize.
 * @param options Glob options.
 * @returns The normalized glob string.
 */
export function normalizeGlob(glob: string, options: GlobOptions = {}): string {
  return isWindows ? windowsNormalizeGlob(glob, options) : posixNormalizeGlob(glob, options);
}
