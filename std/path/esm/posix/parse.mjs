import { assertPath } from "../common/assert-path.mjs";
import { stripTrailingSeparators } from "../common/strip-trailing-separators.mjs";
import { isPosixPathSeparator } from "./util.mjs";
import { CHAR_DOT } from "@neostd/chars/constants";
//#region src/posix/parse.ts
/**
 * Return a `ParsedPath` object of the `path`.
 *
 * @example Usage
 * ```ts
 * import { parse } from "@neostd/path/posix/parse";
 * import { equal } from "node:assert/strict";
 *
 * const path = parse("/home/user/file.txt");
 * equal(path, {
 *   root: "/",
 *   dir: "/home/user",
 *   base: "file.txt",
 *   ext: ".txt",
 *   name: "file"
 * });
 * ```
 *
 * @param path The path to parse.
 * @returns The parsed path object.
 */
function parse(path) {
  assertPath(path);
  const ret = {
    root: "",
    dir: "",
    base: "",
    ext: "",
    name: "",
  };
  if (path.length === 0) return ret;
  const isAbsolute = isPosixPathSeparator(path.charCodeAt(0));
  let start;
  if (isAbsolute) {
    ret.root = "/";
    start = 1;
  } else start = 0;
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let i = path.length - 1;
  let preDotState = 0;
  for (; i >= start; --i) {
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
  ) {
    if (end !== -1)
      if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);
      else ret.base = ret.name = path.slice(startPart, end);
    ret.base = ret.base || "/";
  } else {
    if (startPart === 0 && isAbsolute) {
      ret.name = path.slice(1, startDot);
      ret.base = path.slice(1, end);
    } else {
      ret.name = path.slice(startPart, startDot);
      ret.base = path.slice(startPart, end);
    }
    ret.ext = path.slice(startDot, end);
  }
  if (startPart > 0)
    ret.dir = stripTrailingSeparators(path.slice(0, startPart - 1), isPosixPathSeparator);
  else if (isAbsolute) ret.dir = "/";
  return ret;
}
//#endregion
export { parse };
