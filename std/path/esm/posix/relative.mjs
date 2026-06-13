import { isPosixPathSeparator } from "./util.mjs";
import { assertArgs } from "../common/relative.mjs";
import { resolve } from "./resolve.mjs";
//#region src/posix/relative.ts
/**
 * Return the relative path from `from` to `to` based on current working directory.
 *
 * If `from` and `to` are the same, return an empty string.
 *
 * @example Usage
 * ```ts
 * import { relative } from "@neostd/path/posix/relative";
 * import { equal } from "node:assert/strict";
 *
 * const path = relative("/data/orandea/test/aaa", "/data/orandea/impl/bbb");
 * equal(path, "../../impl/bbb");
 * ```
 *
 * @param from The path to start from.
 * @param to The path to reach.
 * @returns The relative path.
 */
function relative(from, to) {
  assertArgs(from, to);
  from = resolve(from);
  to = resolve(to);
  if (from === to) return "";
  let fromStart = 1;
  const fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart)
    if (!isPosixPathSeparator(from.charCodeAt(fromStart))) break;
  const fromLen = fromEnd - fromStart;
  let toStart = 1;
  const toEnd = to.length;
  for (; toStart < toEnd; ++toStart) if (!isPosixPathSeparator(to.charCodeAt(toStart))) break;
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (isPosixPathSeparator(to.charCodeAt(toStart + i))) return to.slice(toStart + i + 1);
        else if (i === 0) return to.slice(toStart + i);
      } else if (fromLen > length) {
        if (isPosixPathSeparator(from.charCodeAt(fromStart + i))) lastCommonSep = i;
        else if (i === 0) lastCommonSep = 0;
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    if (fromCode !== to.charCodeAt(toStart + i)) break;
    else if (isPosixPathSeparator(fromCode)) lastCommonSep = i;
  }
  let out = "";
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i)
    if (i === fromEnd || isPosixPathSeparator(from.charCodeAt(i)))
      if (out.length === 0) out += "..";
      else out += "/..";
  if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
  else {
    toStart += lastCommonSep;
    if (isPosixPathSeparator(to.charCodeAt(toStart))) ++toStart;
    return to.slice(toStart);
  }
}
//#endregion
export { relative };
