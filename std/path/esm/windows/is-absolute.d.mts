//#region src/windows/is-absolute.d.ts
/**
 * Verifies whether provided path is absolute.
 *
 * @example Usage
 * ```ts
 * import { isAbsolute } from "@neostd/path/windows/is-absolute";
 * import { assert, assertFalse } from "node:assert/strict";
 *
 * assert(isAbsolute("C:\\foo\\bar"));
 * assertFalse(isAbsolute("..\\baz"));
 * ```
 *
 * @param path The path to verify.
 * @returns `true` if the path is absolute, `false` otherwise.
 */
declare function isAbsolute(path: string): boolean;
//#endregion
export { isAbsolute };
