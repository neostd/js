import { isWindows } from "./os.mjs";
import { joinGlobs as joinGlobs$1 } from "./posix/join-globs.mjs";
import { joinGlobs as joinGlobs$2 } from "./windows/join-globs.mjs";
//#region src/join-globs.ts
/**
 * Joins a sequence of globs, then normalizes the resulting glob.
 *
 * Behaves like {@linkcode https://jsr.io/@neostd/path/doc/~/join | join()}, but
 * doesn't collapse `**\/..` when `globstar` is true.
 *
 * @example Usage
 * ```ts
 * import { joinGlobs } from "@neostd/path/join-globs";
 * import { equal } from "node:assert/strict";
 *
 * if (Deno.build.os === "windows") {
 *   equal(joinGlobs(["foo", "bar", "..", "baz"]), "foo\\baz");
 *   equal(joinGlobs(["foo", "**", "bar", "..", "baz"], { globstar: true }), "foo\\**\\baz");
 * } else {
 *   equal(joinGlobs(["foo", "bar", "..", "baz"]), "foo/baz");
 *   equal(joinGlobs(["foo", "**", "bar", "..", "baz"], { globstar: true }), "foo/**\/baz");
 * }
 * ```
 *
 * @param globs Globs to be joined and normalized.
 * @param options Glob options.
 * @returns The joined and normalized glob string.
 */
function joinGlobs(globs, options = {}) {
  return isWindows ? joinGlobs$2(globs, options) : joinGlobs$1(globs, options);
}
//#endregion
export { joinGlobs };
