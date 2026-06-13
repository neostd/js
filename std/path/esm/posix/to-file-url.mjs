import { globals } from "../globals.mjs";
import { encodeWhitespace } from "../common/to-file-url.mjs";
import { isAbsolute } from "./is-absolute.mjs";
//#region src/posix/to-file-url.ts
/**
 * Converts a path string to a file URL.
 *
 * @example Usage
 * ```ts
 * import { toFileUrl } from "@neostd/path/posix/to-file-url";
 * import { equal } from "node:assert/strict";
 *
 * equal(toFileUrl("/home/foo"), new URL("file:///home/foo"));
 * equal(toFileUrl("/home/foo bar"), new URL("file:///home/foo%20bar"));
 * ```
 *
 * @param path The path to convert.
 * @throws TypeError if the path is not absolute.
 * @returns The file URL.
 */
function toFileUrl(path) {
  if (!isAbsolute(path)) throw new TypeError(`Path must be absolute: received "${path}"`);
  const url = new URL("file:///");
  if (!globals.Deno && path.startsWith("//")) path = path.substring(1);
  url.pathname = encodeWhitespace(path.replace(/%/g, "%25").replace(/\\/g, "%5C"));
  return url;
}
//#endregion
export { toFileUrl };
