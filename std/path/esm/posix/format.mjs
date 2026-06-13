import { _format, assertArg } from "../common/format.mjs";
//#region src/posix/format.ts
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
function format(pathObject) {
  assertArg(pathObject);
  return _format("/", pathObject);
}
//#endregion
export { format };
