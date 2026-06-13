import { isWindows } from "./os.mjs";
import { toFileUrl as toFileUrl$1 } from "./posix/to-file-url.mjs";
import { toFileUrl as toFileUrl$2 } from "./windows/to-file-url.mjs";
//#region src/to-file-url.ts
/**
 * Converts a path string to a file URL.
 *
 * @example Usage
 * ```ts
 * import { toFileUrl } from "@neostd/path/to-file-url";
 * import { equal } from "node:assert/strict";
 *
 * if (Deno.build.os === "windows") {
 *   equal(toFileUrl("\\home\\foo"), new URL("file:///home/foo"));
 *   equal(toFileUrl("C:\\Users\\foo"), new URL("file:///C:/Users/foo"));
 *   equal(toFileUrl("\\\\127.0.0.1\\home\\foo"), new URL("file://127.0.0.1/home/foo"));
 * } else {
 *   equal(toFileUrl("/home/foo"), new URL("file:///home/foo"));
 * }
 * ```
 *
 * @param path Path to convert to file URL.
 * @returns The file URL equivalent to the path.
 */
function toFileUrl(path) {
  return isWindows ? toFileUrl$2(path) : toFileUrl$1(path);
}
//#endregion
export { toFileUrl };
