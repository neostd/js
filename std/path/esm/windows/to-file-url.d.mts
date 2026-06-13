//#region src/windows/to-file-url.d.ts
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
declare function toFileUrl(path: string): URL;
//#endregion
export { toFileUrl };
