//#region src/posix/from-file-url.d.ts
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
declare function fromFileUrl(url: URL | string): string;
//#endregion
export { fromFileUrl };
