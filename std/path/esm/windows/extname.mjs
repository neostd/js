import { assertPath } from "../common/assert-path.mjs";
import { CHAR_COLON, CHAR_DOT } from "../common/constants.mjs";
import { isPathSeparator, isWindowsDeviceRoot } from "./util.mjs";
import { fromFileUrl } from "./from-file-url.mjs";
//#region src/windows/extname.ts
/**
 * Return the extension of the `path` with leading period.
 *
 * @example Usage
 * ```ts
 * import { extname } from "@neostd/path/windows/extname";
 * import { equals } from "node:assert/strict";
 *
 * equals(extname("file.ts"), ".ts");
 * equals(extname(new URL("file:///C:/foo/bar/baz.ext")), ".ext");
 * ```
 *
 * @param path The path to get the extension from.
 * @returns The extension of the `path`.
 */
function extname(path) {
  if (path instanceof URL) path = fromFileUrl(path);
  assertPath(path);
  let start = 0;
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  if (
    path.length >= 2 &&
    path.charCodeAt(1) === CHAR_COLON &&
    isWindowsDeviceRoot(path.charCodeAt(0))
  )
    start = startPart = 2;
  for (let i = path.length - 1; i >= start; --i) {
    const code = path.charCodeAt(i);
    if (isPathSeparator(code)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) preDotState = -1;
  }
  if (
    startDot === -1 ||
    end === -1 ||
    preDotState === 0 ||
    (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)
  )
    return "";
  return path.slice(startDot, end);
}
//#endregion
export { extname };
