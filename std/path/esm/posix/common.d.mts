//#region src/posix/common.d.ts
/** Determines the common path from a set of paths for POSIX systems.
 *
 * @example Usage
 * ```ts
 * import { common } from "@neostd/path/posix/common";
 * import { equal } from "node:assert/strict";
 *
 * const path = common([
 *   "./deno/std/path/index.ts",
 *   "./deno/std/fs/index.ts",
 * ]);
 * equal(path, "./deno/std/");
 * ```
 *
 * @param paths The paths to compare.
 * @returns The common path.
 */
declare function common(paths: string[]): string;
//#endregion
export { common };
