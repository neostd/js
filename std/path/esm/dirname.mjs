import { isWindows } from "./os.mjs";
import { dirname as dirname$1 } from "./posix/dirname.mjs";
import { dirname as dirname$2 } from "./windows/dirname.mjs";
//#region src/dirname.ts
/**
 * Return the directory path of a path.
 *
 * @example Usage
 * ```ts
 * import { dirname } from "@neostd/path/dirname";
 * import { equal } from "node:assert/strict";
 *
 * if (Deno.build.os === "windows") {
 *   equal(dirname("C:\\home\\user\\Documents\\image.png"), "C:\\home\\user\\Documents");
 * } else {
 *   equal(dirname("/home/user/Documents/image.png"), "/home/user/Documents");
 * }
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `dirname` from `@neostd/path/unstable-dirname`.
 *
 * @param path Path to extract the directory from.
 * @returns The directory path.
 */
function dirname(path) {
  return isWindows ? dirname$2(path) : dirname$1(path);
}
//#endregion
export { dirname };
