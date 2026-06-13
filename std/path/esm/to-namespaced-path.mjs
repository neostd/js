import { isWindows } from "./os.mjs";
import { toNamespacedPath as toNamespacedPath$1 } from "./posix/to-namespaced-path.mjs";
import { toNamespacedPath as toNamespacedPath$2 } from "./windows/to-namespaced-path.mjs";
//#region src/to-namespaced-path.ts
/**
 * Resolves path to a namespace path.  This is a no-op on
 * non-windows systems.
 *
 * @example Usage
 * ```ts
 * import { toNamespacedPath } from "@neostd/path/to-namespaced-path";
 * import { equal } from "node:assert/strict";
 *
 * if (Deno.build.os === "windows") {
 *   equal(toNamespacedPath("C:\\foo\\bar"), "\\\\?\\C:\\foo\\bar");
 * } else {
 *   equal(toNamespacedPath("/foo/bar"), "/foo/bar");
 * }
 * ```
 *
 * @param path Path to resolve to namespace.
 * @returns The resolved namespace path.
 */
function toNamespacedPath(path) {
  return isWindows ? toNamespacedPath$2(path) : toNamespacedPath$1(path);
}
//#endregion
export { toNamespacedPath };
