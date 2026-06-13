import { isWindows } from "./os.mjs";
import { normalizeGlob as normalizeGlob$1 } from "./posix/normalize-glob.mjs";
import { normalizeGlob as normalizeGlob$2 } from "./windows/normalize-glob.mjs";
//#region src/normalize-glob.ts
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
function normalizeGlob(glob, options = {}) {
  return isWindows ? normalizeGlob$2(glob, options) : normalizeGlob$1(glob, options);
}
//#endregion
export { normalizeGlob };
