import { assertArg } from "../common/from-file-url.mjs";
//#region src/posix/from-file-url.ts
/**
 * Converts a file URL to a path string.
 *
 * @example Usage
 * ```ts
 * import { fromFileUrl } from "@neostd/path/posix/from-file-url";
 * import { equal } from "node:assert/strict";
 *
 * equal(fromFileUrl(new URL("file:///home/foo")), "/home/foo");
 * ```
 *
 * @param url The file URL to convert.
 * @returns The path string.
 */
function fromFileUrl(url) {
  url = assertArg(url);
  return decodeURIComponent(url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}
//#endregion
export { fromFileUrl };
