import { ParsedPath } from "../types.mjs";

//#region src/windows/parse.d.ts
/**
 * Return a `ParsedPath` object of the `path`.
 *
 * @example Usage
 * ```ts
 * import { parse } from "@neostd/path/windows/parse";
 * import { equal } from "node:assert/strict";
 *
 * const parsed = parse("C:\\foo\\bar\\baz.ext");
 * equal(parsed, {
 *   root: "C:\\",
 *   dir: "C:\\foo\\bar",
 *   base: "baz.ext",
 *   ext: ".ext",
 *   name: "baz",
 * });
 * ```
 *
 * @param path The path to parse.
 * @returns The `ParsedPath` object.
 */
declare function parse(path: string): ParsedPath;
//#endregion
export { type ParsedPath, parse };
