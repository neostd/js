import { isWindows } from "./os.mjs";
import { resolve as resolve$1 } from "./posix/resolve.mjs";
import { resolve as resolve$2 } from "./windows/resolve.mjs";
//#region src/resolve.ts
/**
 * Resolves path segments into a path.
 *
 * @example Usage
 * ```ts
 * import { resolve } from "@neostd/path/resolve";
 * import { equal } from "node:assert/strict";
 *
 * if (Deno.build.os === "windows") {
 *   equal(resolve("C:\\foo", "bar", "baz"), "C:\\foo\\bar\\baz");
 *   equal(resolve("C:\\foo", "C:\\bar", "baz"), "C:\\bar\\baz");
 * } else {
 *   equal(resolve("/foo", "bar", "baz"), "/foo/bar/baz");
 *   equal(resolve("/foo", "/bar", "baz"), "/bar/baz");
 * }
 * ```
 *
 * @param pathSegments Path segments to process to path.
 * @returns The resolved path.
 */
function resolve(...pathSegments) {
  return isWindows ? resolve$2(...pathSegments) : resolve$1(...pathSegments);
}
//#endregion
export { resolve };
