import { isWindows } from "./os.mjs";
import { isAbsolute as isAbsolute$1 } from "./posix/is-absolute.mjs";
import { isAbsolute as isAbsolute$2 } from "./windows/is-absolute.mjs";
//#region src/is-absolute.ts
/**
 * Verifies whether provided path is absolute.
 *
 * @example Usage
 * ```ts
 * import { isAbsolute } from "@neostd/path/is-absolute";
 * import { assert, assertFalse } from "node:assert/strict";
 *
 * if (Deno.build.os === "windows") {
 *   assert(isAbsolute("C:\\home\\foo"));
 *   assertFalse(isAbsolute("home\\foo"));
 * } else {
 *   assert(isAbsolute("/home/foo"));
 *   assertFalse(isAbsolute("home/foo"));
 * }
 * ```
 *
 * @param path Path to be verified as absolute.
 * @returns `true` if path is absolute, `false` otherwise
 */
function isAbsolute(path) {
  return isWindows ? isAbsolute$2(path) : isAbsolute$1(path);
}
//#endregion
export { isAbsolute };
