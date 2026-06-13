import { stripTrailingSeparators } from "../common/strip-trailing-separators.mjs";
import { isPathSeparator, isPosixPathSeparator, isWindowsDeviceRoot } from "./util.mjs";
import { fromFileUrl } from "./from-file-url.mjs";
import { assertArg } from "../common/dirname.mjs";
import { CHAR_COLON } from "@neostd/chars/constants";
//#region src/windows/dirname.ts
/**
 * Return the directory path of a `path`.
 *
 * @example Usage
 * ```ts
 * import { dirname } from "@neostd/path/windows/dirname";
 * import { equals } from "node:assert/strict";
 *
 * equals(dirname("C:\\foo\\bar\\baz.ext"), "C:\\foo\\bar");
 * equals(dirname(new URL("file:///C:/foo/bar/baz.ext")), "C:\\foo\\bar");
 * ```
 *
 * @param path The path to get the directory from.
 * @returns The directory path.
 */
function dirname(path) {
  if (path instanceof URL) path = fromFileUrl(path);
  assertArg(path);
  const len = path.length;
  let rootEnd = -1;
  let end = -1;
  let matchedSlash = true;
  let offset = 0;
  const code = path.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code)) {
      rootEnd = offset = 1;
      if (isPathSeparator(path.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) if (isPathSeparator(path.charCodeAt(j))) break;
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) if (!isPathSeparator(path.charCodeAt(j))) break;
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) if (isPathSeparator(path.charCodeAt(j))) break;
            if (j === len) return path;
            if (j !== last) rootEnd = offset = j + 1;
          }
        }
      }
    } else if (isWindowsDeviceRoot(code)) {
      if (path.charCodeAt(1) === CHAR_COLON) {
        rootEnd = offset = 2;
        if (len > 2) {
          if (isPathSeparator(path.charCodeAt(2))) rootEnd = offset = 3;
        }
      }
    }
  } else if (isPathSeparator(code)) return path;
  for (let i = len - 1; i >= offset; --i)
    if (isPathSeparator(path.charCodeAt(i))) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else matchedSlash = false;
  if (end === -1)
    if (rootEnd === -1) return ".";
    else end = rootEnd;
  return stripTrailingSeparators(path.slice(0, end), isPosixPathSeparator);
}
//#endregion
export { dirname };
