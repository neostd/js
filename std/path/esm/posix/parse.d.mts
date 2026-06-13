import { ParsedPath } from "../types.mjs";

//#region src/posix/parse.d.ts
/**
 * Return a `ParsedPath` object of the `path`.
 *
 * @example Usage
 * ```ts
 * import { parse } from "@neostd/path/posix/parse";
 * import { equal } from "node:assert/strict";
 *
 * const path = parse("/home/user/file.txt");
 * equal(path, {
 *   root: "/",
 *   dir: "/home/user",
 *   base: "file.txt",
 *   ext: ".txt",
 *   name: "file"
 * });
 * ```
 *
 * @param path The path to parse.
 * @returns The parsed path object.
 */
declare function parse(path: string): ParsedPath;
//#endregion
export { type ParsedPath, parse };
