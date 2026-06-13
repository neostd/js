import { isWindows } from "./os.mjs";
import { join as join$1 } from "./posix/join.mjs";
import { join as join$2 } from "./windows/join.mjs";
//#region src/join.ts
/**
 * Joins a sequence of paths, then normalizes the resulting path.
 *
 * @example Usage
 * ```ts
 * import { join } from "@neostd/path/join";
 * import { equal } from "node:assert/strict";
 *
 * if (Deno.build.os === "windows") {
 *   equal(join("C:\\foo", "bar", "baz\\quux", "garply", ".."), "C:\\foo\\bar\\baz\\quux");
 * } else {
 *   equal(join("/foo", "bar", "baz/quux", "garply", ".."), "/foo/bar/baz/quux");
 * }
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `join` from `@neostd/path/unstable-join`.
 *
 * @param paths Paths to be joined and normalized.
 * @returns The joined and normalized path.
 */
function join(path, ...paths) {
  return isWindows ? join$2(path, ...paths) : join$1(path, ...paths);
}
//#endregion
export { join };
