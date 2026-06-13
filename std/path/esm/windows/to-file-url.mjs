import { encodeWhitespace } from "../common/to-file-url.mjs";
import { isAbsolute } from "./is-absolute.mjs";
//#region src/windows/to-file-url.ts
/**
 * Converts a path string to a file URL.
 *
 * @example Usage
 * ```ts
 * import { toFileUrl } from "@neostd/path/windows/to-file-url";
 * import { equal } from "node:assert/strict";
 *
 * equal(toFileUrl("\\home\\foo"), new URL("file:///home/foo"));
 * equal(toFileUrl("C:\\Users\\foo"), new URL("file:///C:/Users/foo"));
 * equal(toFileUrl("\\\\127.0.0.1\\home\\foo"), new URL("file://127.0.0.1/home/foo"));
 * ```
 * @param path The path to convert.
 * @throws TypeError if the path is not absolute.
 * @throws TypeError if the hostname is invalid.
 * @returns The file URL.
 */
function toFileUrl(path) {
  if (!isAbsolute(path)) throw new TypeError(`Path must be absolute: received "${path}"`);
  const [, hostname, pathname] = path.match(/^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/);
  const url = new URL("file:///");
  url.pathname = encodeWhitespace(pathname.replace(/%/g, "%25"));
  if (hostname !== void 0 && hostname !== "localhost") {
    url.hostname = hostname;
    if (!url.hostname) throw new TypeError(`Invalid hostname: "${url.hostname}"`);
  }
  return url;
}
//#endregion
export { toFileUrl };
