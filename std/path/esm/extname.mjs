import { isWindows } from "./os.mjs";
import { extname as extname$1 } from "./posix/extname.mjs";
import { extname as extname$2 } from "./windows/extname.mjs";
//#region src/extname.ts
/**
 * Return the extension of the path with leading period (".").
 *
 * @example Usage
 * ```ts
 * import { extname } from "@neostd/path/extname";
 * import { equal } from "node:assert/strict";
 *
 * if (Deno.build.os === "windows") {
 *   equal(extname("C:\\home\\user\\Documents\\image.png"), ".png");
 * } else {
 *   equal(extname("/home/user/Documents/image.png"), ".png");
 * }
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `extname` from `@neostd/path/unstable-extname`.
 *
 * @param path Path with extension.
 * @returns The file extension. E.g. returns `.ts` for `file.ts`.
 */
function extname(path) {
  return isWindows ? extname$2(path) : extname$1(path);
}
//#endregion
export { extname };
