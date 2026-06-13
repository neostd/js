//#region src/windows/join.d.ts
/**
 * Join all given a sequence of `paths`,then normalizes the resulting path.
 *
 * @example Usage
 * ```ts
 * import { join } from "@neostd/path/windows/join";
 * import { equal } from "node:assert/strict";
 *
 * const joined = join("C:\\foo", "bar", "baz\\..");
 * equal(joined, "C:\\foo\\bar");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `join` from `@neostd/path/windows/unstable-join`.
 *
 * @param paths The paths to join.
 * @returns The joined path.
 */
declare function join(path?: URL | string, ...paths: string[]): string;
//#endregion
export { join };
