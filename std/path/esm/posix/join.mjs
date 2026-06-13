import { assertPath } from "../common/assert-path.mjs";
import { fromFileUrl } from "./from-file-url.mjs";
import { normalize } from "./normalize.mjs";
//#region src/posix/join.ts
/**
 * Join all given a sequence of `paths`,then normalizes the resulting path.
 *
 * @example Usage
 * ```ts
 * import { join } from "@neostd/path/posix/join";
 * import { equal } from "node:assert/strict";
 *
 * const path = join("/foo", "bar", "baz/asdf", "quux", "..");
 * equal(path, "/foo/bar/baz/asdf");
 * ```
 *
 * @example Working with URLs
 * ```ts
 * import { join } from "@neostd/path/posix/join";
 * import { equal } from "node:assert/strict";
 *
 * const url = new URL("https://deno.land");
 * url.pathname = join("std", "path", "index.ts");
 * equal(url.href, "https://deno.land/std/path/index.ts");
 *
 * url.pathname = join("//std", "path/", "/index.ts");
 * equal(url.href, "https://deno.land/std/path/index.ts");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `join` from `@neostd/path/posix/unstable-join`.
 *
 * @param paths The paths to join.
 * @returns The joined path.
 */
function join(path, ...paths) {
  if (path === void 0) return ".";
  if (path instanceof URL) path = fromFileUrl(path);
  paths = path ? [path, ...paths] : paths;
  paths.forEach((path) => assertPath(path));
  const joined = paths.filter((path) => path.length > 0).join("/");
  return joined === "" ? "." : normalize(joined);
}
//#endregion
export { join };
