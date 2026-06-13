import { isWindows } from "./os.mjs";
import { fromFileUrl as fromFileUrl$1 } from "./posix/from-file-url.mjs";
import { fromFileUrl as fromFileUrl$2 } from "./windows/from-file-url.mjs";
//#region src/from-file-url.ts
/**
 * Converts a file URL to a path string.
 *
 * @example Usage
 * ```ts
 * import { fromFileUrl } from "@neostd/path/from-file-url";
 * import { equal } from "node:assert/strict";
 *
 * if (Deno.build.os === "windows") {
 *   equal(fromFileUrl("file:///home/foo"), "\\home\\foo");
 *   equal(fromFileUrl("file:///C:/Users/foo"), "C:\\Users\\foo");
 *   equal(fromFileUrl("file://localhost/home/foo"), "\\home\\foo");
 * } else {
 *   equal(fromFileUrl("file:///home/foo"), "/home/foo");
 * }
 * ```
 *
 * @param url The file URL to convert to a path.
 * @returns The path string.
 */
function fromFileUrl(url) {
  return isWindows ? fromFileUrl$2(url) : fromFileUrl$1(url);
}
//#endregion
export { fromFileUrl };
