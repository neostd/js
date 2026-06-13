import { common as common$1 } from "../common/common.mjs";
import "./constants.mjs";
//#region src/windows/common.ts
/**
 * Determines the common path from a set of paths for Windows systems.
 *
 * @example Usage
 * ```ts
 * import { common } from "@neostd/path/windows/common";
 * import { equal } from "node:assert/strict";
 *
 * const path = common([
 *   "C:\\foo\\bar",
 *   "C:\\foo\\baz",
 * ]);
 * equal(path, "C:\\foo\\");
 * ```
 *
 * @param paths The paths to compare.
 * @returns The common path.
 */
function common(paths) {
  return common$1(paths, "\\");
}
//#endregion
export { common };
