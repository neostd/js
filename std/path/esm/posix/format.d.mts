import { ParsedPath } from "../types.mjs";

//#region src/posix/format.d.ts
/**
 * Generate a path from `ParsedPath` object.
 *
 * @example Usage
 * ```ts
 * import { format } from "@neostd/path/posix/format";
 * import { equal } from "node:assert/strict";
 *
 * const path = format({
 *   root: "/",
 *   dir: "/path/dir",
 *   base: "file.txt",
 *   ext: ".txt",
 *   name: "file"
 * });
 * equal(path, "/path/dir/file.txt");
 * ```
 *
 * @param pathObject The path object to format.
 * @returns The formatted path.
 */
declare function format(pathObject: Partial<ParsedPath>): string;
//#endregion
export { format };
