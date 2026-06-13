import { common as common$1 } from "../common/common.mjs";
import "./constants.mjs";
//#region src/posix/common.ts
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
function common(paths) {
  return common$1(paths, "/");
}
//#endregion
export { common };
