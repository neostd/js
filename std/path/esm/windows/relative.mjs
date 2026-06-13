import { assertArgs } from "../common/relative.mjs";
import { resolve } from "./resolve.mjs";
import { CHAR_BACKWARD_SLASH } from "@neostd/chars/constants";
//#region src/windows/relative.ts
/**
 * Return the relative path from `from` to `to` based on current working directory.
 *
 * An example in windws, for instance:
 *  from = 'C:\\orandea\\test\\aaa'
 *  to = 'C:\\orandea\\impl\\bbb'
 * The output of the function should be: '..\\..\\impl\\bbb'
 *
 * @example Usage
 * ```ts
 * import { relative } from "@neostd/path/windows/relative";
 * import { equal } from "node:assert/strict";
 *
 * const relativePath = relative("C:\\foobar\\test\\aaa", "C:\\foobar\\impl\\bbb");
 * equal(relativePath, "..\\..\\impl\\bbb");
 * ```
 *
 * @param from The path from which to calculate the relative path
 * @param to The path to which to calculate the relative path
 * @returns The relative path from `from` to `to`
 */
function relative(from, to) {
  assertArgs(from, to);
  const fromOrig = resolve(from);
  const toOrig = resolve(to);
  if (fromOrig === toOrig) return "";
  from = fromOrig.toLowerCase();
  to = toOrig.toLowerCase();
  if (from === to) return "";
  let fromStart = 0;
  let fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart)
    if (from.charCodeAt(fromStart) !== CHAR_BACKWARD_SLASH) break;
  for (; fromEnd - 1 > fromStart; --fromEnd)
    if (from.charCodeAt(fromEnd - 1) !== CHAR_BACKWARD_SLASH) break;
  const fromLen = fromEnd - fromStart;
  let toStart = 0;
  let toEnd = to.length;
  for (; toStart < toEnd; ++toStart) if (to.charCodeAt(toStart) !== CHAR_BACKWARD_SLASH) break;
  for (; toEnd - 1 > toStart; --toEnd) if (to.charCodeAt(toEnd - 1) !== CHAR_BACKWARD_SLASH) break;
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_BACKWARD_SLASH)
          return toOrig.slice(toStart + i + 1);
        else if (i === 2) return toOrig.slice(toStart + i);
      }
      if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === CHAR_BACKWARD_SLASH) lastCommonSep = i;
        else if (i === 2) lastCommonSep = 3;
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    if (fromCode !== to.charCodeAt(toStart + i)) break;
    else if (fromCode === CHAR_BACKWARD_SLASH) lastCommonSep = i;
  }
  if (i !== length && lastCommonSep === -1) return toOrig;
  let out = "";
  if (lastCommonSep === -1) lastCommonSep = 0;
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i)
    if (i === fromEnd || from.charCodeAt(i) === CHAR_BACKWARD_SLASH)
      if (out.length === 0) out += "..";
      else out += "\\..";
  if (out.length > 0) return out + toOrig.slice(toStart + lastCommonSep, toEnd);
  else {
    toStart += lastCommonSep;
    if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH) ++toStart;
    return toOrig.slice(toStart, toEnd);
  }
}
//#endregion
export { relative };
