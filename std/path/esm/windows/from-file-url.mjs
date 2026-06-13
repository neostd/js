import { assertArg } from "../common/from-file-url.mjs";
//#region src/windows/from-file-url.ts
/**
 * Converts a file URL to a path string.
 *
 * @example Usage
 * ```ts
 * import { fromFileUrl } from "@neostd/path/windows/from-file-url";
 * import { equal } from "node:assert/strict";
 *
 * equal(fromFileUrl("file:///home/foo"), "\\home\\foo");
 * equal(fromFileUrl("file:///C:/Users/foo"), "C:\\Users\\foo");
 * equal(fromFileUrl("file://localhost/home/foo"), "\\home\\foo");
 * ```
 *
 * @param url The file URL to convert.
 * @returns The path string.
 */
function fromFileUrl(url) {
  url = assertArg(url);
  let path = decodeURIComponent(
    url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25"),
  ).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  if (url.hostname !== "") path = `\\\\${url.hostname}${path}`;
  return path;
}
//#endregion
export { fromFileUrl };
