import { assertArgs, lastPathSegment, stripSuffix } from "../common/basename.mjs";
import { stripTrailingSeparators } from "../common/strip-trailing-separators.mjs";
import { CHAR_COLON } from "../common/constants.mjs";
import { isPathSeparator, isWindowsDeviceRoot } from "./util.mjs";
import { fromFileUrl } from "./from-file-url.mjs";
//#region src/windows/basename.ts
/**
 * Return the last portion of a `path`.
 * Trailing directory separators are ignored, and optional suffix is removed.
 *
 * @example Usage
 * ```ts
 * import { basename } from "@neostd/path/windows/basename";
 * import { equals } from "node:assert/strict";
 *
 * equals(basename("C:\\user\\Documents\\"), "Documents");
 * equals(basename("C:\\user\\Documents\\image.png"), "image.png");
 * equals(basename("C:\\user\\Documents\\image.png", ".png"), "image");
 * equals(basename(new URL("file:///C:/user/Documents/image.png")), "image.png");
 * equals(basename(new URL("file:///C:/user/Documents/image.png"), ".png"), "image");
 * ```
 *
 * @param path The path to extract the name from.
 * @param suffix The suffix to remove from extracted name.
 * @returns The extracted name.
 */
function basename(path, suffix = "") {
  if (path instanceof URL) path = fromFileUrl(path);
  assertArgs(path, suffix);
  let start = 0;
  if (path.length >= 2) {
    if (isWindowsDeviceRoot(path.charCodeAt(0))) {
      if (path.charCodeAt(1) === CHAR_COLON) start = 2;
    }
  }
  const strippedSegment = stripTrailingSeparators(
    lastPathSegment(path, isPathSeparator, start),
    isPathSeparator,
  );
  return suffix ? stripSuffix(strippedSegment, suffix) : strippedSegment;
}
//#endregion
export { basename };
