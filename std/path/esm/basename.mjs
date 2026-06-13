import { isWindows } from "./os.mjs";
import { basename as basename$1 } from "./posix/basename.mjs";
import { basename as basename$2 } from "./windows/basename.mjs";
//#region src/basename.ts
/**
 * Return the last portion of a path.
 *
 * The trailing directory separators are ignored, and optional suffix is
 * removed.
 *
 * @example Usage
 * ```ts
 * import { basename } from "@neostd/path/basename";
 * import { equal } from "node:assert/strict";
 *
 * if (Deno.build.os === "windows") {
 *   equal(basename("C:\\user\\Documents\\image.png"), "image.png");
 * } else {
 *   equal(basename("/home/user/Documents/image.png"), "image.png");
 * }
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `basename` from `@neostd/path/unstable-basename`.
 *
 * @param path Path to extract the name from.
 * @param suffix Suffix to remove from extracted name.
 *
 * @returns The basename of the path.
 */
function basename(path, suffix = "") {
  return isWindows ? basename$2(path, suffix) : basename$1(path, suffix);
}
//#endregion
export { basename };
