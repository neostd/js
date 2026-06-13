import { isPathSeparator, isWindowsDeviceRoot } from "./util.mjs";
import { fromFileUrl } from "./from-file-url.mjs";
import { normalizeString } from "../common/normalize-string.mjs";
import { assertArg } from "../common/normalize.mjs";
import { CHAR_COLON } from "@neostd/chars/constants";
//#region src/windows/normalize.ts
/**
 * Normalize the `path`, resolving `'..'` and `'.'` segments.
 * Note that resolving these segments does not necessarily mean that all will be eliminated.
 * A `'..'` at the top-level will be preserved, and an empty path is canonically `'.'`.
 *
 * @example Usage
 * ```ts
 * import { normalize } from "@neostd/path/windows/normalize";
 * import { equal } from "node:assert/strict";
 *
 * const normalized = normalize("C:\\foo\\..\\bar");
 * equal(normalized, "C:\\bar");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `normalize` from `@neostd/path/windows/unstable-normalize`.
 *
 * @param path The path to normalize
 * @returns The normalized path
 */
function normalize(path) {
  if (path instanceof URL) path = fromFileUrl(path);
  assertArg(path);
  const len = path.length;
  let rootEnd = 0;
  let device;
  let isAbsolute = false;
  const code = path.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code)) {
      isAbsolute = true;
      if (isPathSeparator(path.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) if (isPathSeparator(path.charCodeAt(j))) break;
        if (j < len && j !== last) {
          const firstPart = path.slice(last, j);
          last = j;
          for (; j < len; ++j) if (!isPathSeparator(path.charCodeAt(j))) break;
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) if (isPathSeparator(path.charCodeAt(j))) break;
            if (j === len) return `\\\\${firstPart}\\${path.slice(last)}\\`;
            else if (j !== last) {
              device = `\\\\${firstPart}\\${path.slice(last, j)}`;
              rootEnd = j;
            }
          }
        }
      } else rootEnd = 1;
    } else if (isWindowsDeviceRoot(code)) {
      if (path.charCodeAt(1) === CHAR_COLON) {
        device = path.slice(0, 2);
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator(path.charCodeAt(2))) {
            isAbsolute = true;
            rootEnd = 3;
          }
        }
      }
    }
  } else if (isPathSeparator(code)) return "\\";
  let tail;
  if (rootEnd < len)
    tail = normalizeString(path.slice(rootEnd), !isAbsolute, "\\", isPathSeparator);
  else tail = "";
  if (tail.length === 0 && !isAbsolute) tail = ".";
  if (tail.length > 0 && isPathSeparator(path.charCodeAt(len - 1))) tail += "\\";
  if (device === void 0) {
    if (isAbsolute)
      if (tail.length > 0) return `\\${tail}`;
      else return "\\";
    return tail;
  } else if (isAbsolute)
    if (tail.length > 0) return `${device}\\${tail}`;
    else return `${device}\\`;
  return device + tail;
}
//#endregion
export { normalize };
