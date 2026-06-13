import { isWindows } from "./os.mjs";
import { normalize as normalize$1 } from "./posix/normalize.mjs";
import { normalize as normalize$2 } from "./windows/normalize.mjs";
//#region src/normalize.ts
/**
 * Normalize the path, resolving `'..'` and `'.'` segments.
 *
 * Note: Resolving these segments does not necessarily mean that all will be
 * eliminated. A `'..'` at the top-level will be preserved, and an empty path is
 * canonically `'.'`.
 *
 * @example Usage
 * ```ts
 * import { normalize } from "@neostd/path/normalize";
 * import { equal } from "node:assert/strict";
 *
 * if (Deno.build.os === "windows") {
 *   equal(normalize("C:\\foo\\bar\\..\\baz\\quux"), "C:\\foo\\baz\\quux");
 * } else {
 *   equal(normalize("/foo/bar/../baz/quux"), "/foo/baz/quux");
 * }
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `normalize` from `@neostd/path/unstable-normalize`.
 *
 * @param path Path to be normalized
 * @returns The normalized path.
 */
function normalize(path) {
  return isWindows ? normalize$2(path) : normalize$1(path);
}
//#endregion
export { normalize };
