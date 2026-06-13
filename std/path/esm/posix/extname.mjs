import { assertPath } from "../common/assert-path.mjs";
import { isPosixPathSeparator } from "./util.mjs";
import { fromFileUrl } from "./from-file-url.mjs";
import { CHAR_DOT } from "@neostd/chars/constants";
//#region src/posix/extname.ts
/**
 * Return the extension of the `path` with leading period.
 *
 * @example Usage
 * ```ts
 * import { extname } from "@neostd/path/posix/extname";
 * import { equal } from "node:assert/strict";
 *
 * equal(extname("/home/user/Documents/file.ts"), ".ts");
 * equal(extname("/home/user/Documents/"), "");
 * equal(extname("/home/user/Documents/image.png"), ".png");
 * ```
 *
 * @example Working with URLs
 *
 * Note: This function doesn't automatically strip hash and query parts from
 * URLs. If your URL contains a hash or query, remove them before passing the
 * URL to the function. This can be done by passing the URL to `new URL(url)`,
 * and setting the `hash` and `search` properties to empty strings.
 *
 * ```ts
 * import { extname } from "@neostd/path/posix/extname";
 * import { equal } from "node:assert/strict";
 *
 * equal(extname("https://deno.land/std/path/index.ts"), ".ts");
 * equal(extname("https://deno.land/std/path/index.ts?a=b"), ".ts?a=b");
 * equal(extname("https://deno.land/std/path/index.ts#header"), ".ts#header");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `extname` from `@neostd/path/posix/unstable-extname`.
 *
 * @param path The path to get the extension from.
 * @returns The extension (ex. for `file.ts` returns `.ts`).
 */
function extname(path) {
  if (path instanceof URL) path = fromFileUrl(path);
  assertPath(path);
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  for (let i = path.length - 1; i >= 0; --i) {
    const code = path.charCodeAt(i);
    if (isPosixPathSeparator(code)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT) {
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) preDotState = -1;
  }
  if (
    startDot === -1 ||
    end === -1 ||
    preDotState === 0 ||
    (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)
  )
    return "";
  return path.slice(startDot, end);
}
//#endregion
export { extname };
