import { isPosixPathSeparator } from "./util.mjs";
import { fromFileUrl } from "./from-file-url.mjs";
import { normalizeString } from "../common/normalize-string.mjs";
import { assertArg } from "../common/normalize.mjs";
//#region src/posix/normalize.ts
/**
 * Normalize the `path`, resolving `'..'` and `'.'` segments.
 * Note that resolving these segments does not necessarily mean that all will be eliminated.
 * A `'..'` at the top-level will be preserved, and an empty path is canonically `'.'`.
 *
 * @example Usage
 * ```ts
 * import { normalize } from "@neostd/path/posix/normalize";
 * import { equal } from "node:assert/strict";
 *
 * const path = normalize("/foo/bar//baz/asdf/quux/..");
 * equal(path, "/foo/bar/baz/asdf");
 * ```
 *
 * @example Working with URLs
 *
 * Note: This function will remove the double slashes from a URL's scheme.
 * Hence, do not pass a full URL to this function. Instead, pass the pathname of
 * the URL.
 *
 * ```ts
 * import { normalize } from "@neostd/path/posix/normalize";
 * import { equal } from "node:assert/strict";
 *
 * const url = new URL("https://deno.land");
 * url.pathname = normalize("//std//assert//.//index.ts");
 * equal(url.href, "https://deno.land/std/assert/index.ts");
 *
 * url.pathname = normalize("std/assert/../async/retry.ts");
 * equal(url.href, "https://deno.land/std/async/retry.ts");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `normalize` from `@neostd/path/posix/unstable-normalize`.
 *
 * @param path The path to normalize.
 * @returns The normalized path.
 */
function normalize(path) {
  if (path instanceof URL) path = fromFileUrl(path);
  assertArg(path);
  const isAbsolute = isPosixPathSeparator(path.charCodeAt(0));
  const trailingSeparator = isPosixPathSeparator(path.charCodeAt(path.length - 1));
  path = normalizeString(path, !isAbsolute, "/", isPosixPathSeparator);
  if (path.length === 0 && !isAbsolute) path = ".";
  if (path.length > 0 && trailingSeparator) path += "/";
  if (isAbsolute) return `/${path}`;
  return path;
}
//#endregion
export { normalize };
