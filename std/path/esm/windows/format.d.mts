import { ParsedPath } from "../types.mjs";

//#region src/windows/format.d.ts
/**
 * Generate a path from `ParsedPath` object.
 *
 * @example Usage
 * ```ts
 * import { format } from "@neostd/path/windows/format";
 * import { equal } from "node:assert/strict";
 *
 * const path = format({
 *   root: "C:\\",
 *   dir: "C:\\path\\dir",
 *   base: "file.txt",
 *   ext: ".txt",
 *   name: "file"
 * });
 * equal(path, "C:\\path\\dir\\file.txt");
 * ```
 *
 * @param pathObject The path object to format.
 * @returns The formatted path.
 */
declare function format(pathObject: Partial<ParsedPath>): string;
//#endregion
export { format };
