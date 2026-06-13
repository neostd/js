import { assertPath } from "../common/assert-path.mjs";
import { isPosixPathSeparator } from "./util.mjs";
//#region src/posix/is-absolute.ts
/**
 * Verifies whether provided path is absolute.
 *
 * @example Usage
 * ```ts
 * import { isAbsolute } from "@neostd/path/posix/is-absolute";
 * import { assert, assertFalse } from "node:assert/strict";
 *
 * assert(isAbsolute("/home/user/Documents/"));
 * assertFalse(isAbsolute("home/user/Documents/"));
 * ```
 *
 * @param path The path to verify.
 * @returns Whether the path is absolute.
 */
function isAbsolute(path) {
  assertPath(path);
  return path.length > 0 && isPosixPathSeparator(path.charCodeAt(0));
}
//#endregion
export { isAbsolute };
