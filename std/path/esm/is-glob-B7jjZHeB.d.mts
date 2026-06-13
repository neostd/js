//#region src/is-glob.d.ts
/**
 * Test whether the given string is a glob.
 *
 * @example Usage
 * ```ts
 * import { isGlob } from "@neostd/path/is-glob";
 * import { assert } from "node:assert/strict";
 *
 * assert(!isGlob("foo/bar/../baz"));
 * assert(isGlob("foo/*ar/../baz"));
 * ```
 *
 * @param str String to test.
 * @returns `true` if the given string is a glob, otherwise `false`
 */
declare function isGlob(str: string): boolean;
//#endregion
export { isGlob as t };
