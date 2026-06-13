//#region src/posix/is-absolute.d.ts
/**
 * Verifies whether provided path is absolute.
 *
 * @example Usage
 * ```ts
 * import { isAbsolute } from "@neostd/path/posix/is-absolute";
 * import { assert, assertFalse } from "node:assert/strict";
 *
 * assert(isAbsolute("/home/user/Documents/"));
 * assertFalse(isAbsolute("home/user/Documents/"));
 * ```
 *
 * @param path The path to verify.
 * @returns Whether the path is absolute.
 */
declare function isAbsolute(path: string): boolean;
//#endregion
export { isAbsolute };
