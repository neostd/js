import { assertPath } from "../common/assert-path.mjs";
import { isPathSeparator } from "./util.mjs";
import { fromFileUrl } from "./from-file-url.mjs";
import { normalize } from "./normalize.mjs";
//#region src/windows/join.ts
/**
 * Join all given a sequence of `paths`,then normalizes the resulting path.
 *
 * @example Usage
 * ```ts
 * import { join } from "@neostd/path/windows/join";
 * import { equal } from "node:assert/strict";
 *
 * const joined = join("C:\\foo", "bar", "baz\\..");
 * equal(joined, "C:\\foo\\bar");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `join` from `@neostd/path/windows/unstable-join`.
 *
 * @param paths The paths to join.
 * @returns The joined path.
 */
function join(path, ...paths) {
  if (path instanceof URL) path = fromFileUrl(path);
  paths = path ? [path, ...paths] : paths;
  paths.forEach((path) => assertPath(path));
  paths = paths.filter((path) => path.length > 0);
  if (paths.length === 0) return ".";
  let needsReplace = true;
  let slashCount = 0;
  const firstPart = paths[0];
  if (isPathSeparator(firstPart.charCodeAt(0))) {
    ++slashCount;
    const firstLen = firstPart.length;
    if (firstLen > 1) {
      if (isPathSeparator(firstPart.charCodeAt(1))) {
        ++slashCount;
        if (firstLen > 2)
          if (isPathSeparator(firstPart.charCodeAt(2))) ++slashCount;
          else needsReplace = false;
      }
    }
  }
  let joined = paths.join("\\");
  if (needsReplace) {
    for (; slashCount < joined.length; ++slashCount)
      if (!isPathSeparator(joined.charCodeAt(slashCount))) break;
    if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
  }
  return normalize(joined);
}
//#endregion
export { join };
