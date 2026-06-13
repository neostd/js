import { normalize } from "./normalize.mjs";
import { SEPARATOR_PATTERN } from "./constants.mjs";
//#region src/posix/normalize-glob.ts
const NULL_MARKER = "\0";
/**
 * Like normalize(), but doesn't collapse "**\/.." when `globstar` is true.
 *
 * @example Usage
 * ```ts
 * import { normalizeGlob } from "@neostd/path/posix/normalize-glob";
 * import { equal } from "node:assert/strict";
 *
 * const path = normalizeGlob("foo/bar/../*", { globstar: true });
 * equal(path, "foo/*");
 * ```
 *
 * @param glob The glob to normalize.
 * @param options The options to use.
 * @throws Error if the glob contains invalid characters.
 * @returns The normalized path.
 */
function normalizeGlob(glob, options = {}) {
  const { globstar = false } = options;
  if (glob.includes(NULL_MARKER)) throw new Error(`Glob contains invalid characters: "${glob}"`);
  if (!globstar) return normalize(glob);
  const s = SEPARATOR_PATTERN.source;
  const badParentPattern = new RegExp(`(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`, "g");
  return normalize(glob.replace(badParentPattern, NULL_MARKER)).replaceAll(NULL_MARKER, "..");
}
//#endregion
export { normalizeGlob };
