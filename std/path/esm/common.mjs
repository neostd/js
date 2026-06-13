import { common as common$1 } from "./common/common.mjs";
import { SEPARATOR } from "./constants.mjs";
//#region src/common.ts
/**
 * Determines the common path from a set of paths for the given OS.
 *
 * @param paths Paths to search for common path.
 * @returns The common path.
 *
 * @example Usage
 * ```ts
 * import { common } from "@neostd/path/common";
 * import { equal } from "node:assert/strict";
 *
 * if (Deno.build.os === "windows") {
 *   const path = common([
 *     "C:\\deno\\std\\path\\index.ts",
 *     "C:\\deno\\std\\fs\\index.ts"
 *   ]);
 *   equal(path, "C:\\deno\\std\\");
 * } else {
 *   const path = common([
 *     "./deno/std/path/index.ts",
 *     "./deno/std/fs/index.ts"
 *   ]);
 *   equal(path, "./deno/std/");
 * }
 * ```
 */
function common(paths) {
  return common$1(paths, SEPARATOR);
}
//#endregion
export { common };
