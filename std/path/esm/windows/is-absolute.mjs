import { assertPath } from "../common/assert-path.mjs";
import { isPathSeparator, isWindowsDeviceRoot } from "./util.mjs";
import { CHAR_COLON } from "@neostd/chars/constants";
//#region src/windows/is-absolute.ts
/**
 * Verifies whether provided path is absolute.
 *
 * @example Usage
 * ```ts
 * import { isAbsolute } from "@neostd/path/windows/is-absolute";
 * import { assert, assertFalse } from "node:assert/strict";
 *
 * assert(isAbsolute("C:\\foo\\bar"));
 * assertFalse(isAbsolute("..\\baz"));
 * ```
 *
 * @param path The path to verify.
 * @returns `true` if the path is absolute, `false` otherwise.
 */
function isAbsolute(path) {
  assertPath(path);
  const len = path.length;
  if (len === 0) return false;
  const code = path.charCodeAt(0);
  if (isPathSeparator(code)) return true;
  else if (isWindowsDeviceRoot(code)) {
    if (len > 2 && path.charCodeAt(1) === CHAR_COLON) {
      if (isPathSeparator(path.charCodeAt(2))) return true;
    }
  }
  return false;
}
//#endregion
export { isAbsolute };
