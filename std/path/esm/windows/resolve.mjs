import { cwd } from "../globals.mjs";
import { assertPath } from "../common/assert-path.mjs";
import { isPathSeparator, isWindowsDeviceRoot } from "./util.mjs";
import { normalizeString } from "../common/normalize-string.mjs";
import { CHAR_COLON } from "@neostd/chars/constants";
//#region src/windows/resolve.ts
/**
 * Resolves path segments into a `path`.
 *
 * @example Usage
 * ```ts
 * import { resolve } from "@neostd/path/windows/resolve";
 * import { equal } from "node:assert/strict";
 *
 * const resolved = resolve("C:\\foo\\bar", "..\\baz");
 * equal(resolved, "C:\\foo\\baz");
 * ```
 *
 * @param pathSegments The path segments to process to path
 * @returns The resolved path
 */
function resolve(...pathSegments) {
  let resolvedDevice = "";
  let resolvedTail = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1; i--) {
    let path;
    if (i >= 0) path = pathSegments[i];
    else if (!resolvedDevice) path = cwd();
    else {
      path = cwd();
      if (path === void 0 || path.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`)
        path = `${resolvedDevice}\\`;
    }
    assertPath(path);
    const len = path.length;
    if (len === 0) continue;
    let rootEnd = 0;
    let device = "";
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
              if (j === len) {
                device = `\\\\${firstPart}\\${path.slice(last)}`;
                rootEnd = j;
              } else if (j !== last) {
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
    } else if (isPathSeparator(code)) {
      rootEnd = 1;
      isAbsolute = true;
    }
    if (
      device.length > 0 &&
      resolvedDevice.length > 0 &&
      device.toLowerCase() !== resolvedDevice.toLowerCase()
    )
      continue;
    if (resolvedDevice.length === 0 && device.length > 0) resolvedDevice = device;
    if (!resolvedAbsolute) {
      resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
      resolvedAbsolute = isAbsolute;
    }
    if (resolvedAbsolute && resolvedDevice.length > 0) break;
  }
  resolvedTail = normalizeString(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator);
  return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
//#endregion
export { resolve };
