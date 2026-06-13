import { n as GlobOptions } from "./glob-to-reg-exp-hiM9A6iV.mjs";

//#region src/normalize-glob.d.ts
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
declare function normalizeGlob(glob: string, options?: GlobOptions): string;
//#endregion
export { type GlobOptions, normalizeGlob };
