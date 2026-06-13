//#region src/is-glob.ts
/**
 * Test whether the given string is a glob.
 *
 * @example Usage
 * ```ts
 * import { isGlob } from "@neostd/path/is-glob";
 * import { assert } from "node:assert/strict";
 *
 * assert(!isGlob("foo/bar/../baz"));
 * assert(isGlob("foo/*ar/../baz"));
 * ```
 *
 * @param str String to test.
 * @returns `true` if the given string is a glob, otherwise `false`
 */
function isGlob(str) {
  const chars = {
    "{": "}",
    "(": ")",
    "[": "]",
  };
  const regex =
    /\\(.)|(^!|\*|\?|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
  if (str === "") return false;
  let match = regex.exec(str);
  while (match) {
    if (match[2]) return true;
    let idx = match.index + match[0].length;
    const open = match[1];
    const close = open ? chars[open] : null;
    if (open && close) {
      const n = str.indexOf(close, idx);
      if (n !== -1) idx = n + 1;
    }
    str = str.slice(idx);
    match = regex.exec(str);
  }
  return false;
}
//#endregion
export { isGlob };
