import { cwd } from "../globals.mjs";
import { assertPath } from "../common/assert-path.mjs";
import { isPosixPathSeparator } from "./util.mjs";
import { normalizeString } from "../common/normalize-string.mjs";
//#region src/posix/resolve.ts
/**
 * Resolves path segments into a `path`.
 *
 * @example Usage
 * ```ts
 * import { resolve } from "@neostd/path/posix/resolve";
 * import { equal } from "node:assert/strict";
 *
 * const path = resolve("/foo", "bar", "baz/asdf", "quux", "..");
 * equal(path, "/foo/bar/baz/asdf");
 * ```
 *
 * @param pathSegments The path segments to resolve.
 * @returns The resolved path.
 */
function resolve(...pathSegments) {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path;
    if (i >= 0) path = pathSegments[i];
    else path = cwd();
    assertPath(path);
    if (path.length === 0) continue;
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isPosixPathSeparator(path.charCodeAt(0));
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator);
  if (resolvedAbsolute)
    if (resolvedPath.length > 0) return `/${resolvedPath}`;
    else return "/";
  else if (resolvedPath.length > 0) return resolvedPath;
  else return ".";
}
//#endregion
export { resolve };
