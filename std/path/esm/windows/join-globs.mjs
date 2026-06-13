import { join } from "./join.mjs";
import "./constants.mjs";
import { normalizeGlob } from "./normalize-glob.mjs";
//#region src/windows/join-globs.ts
/**
 * Like join(), but doesn't collapse "**\/.." when `globstar` is true.
 *
 * @example Usage
 *
 * ```ts
 * import { joinGlobs } from "@neostd/path/windows/join-globs";
 * import { equal } from "node:assert/strict";
 *
 * const joined = joinGlobs(["foo", "**", "bar"], { globstar: true });
 * equal(joined, "foo\\**\\bar");
 * ```
 *
 * @param globs The globs to join.
 * @param options The options for glob pattern.
 * @returns The joined glob pattern.
 */
function joinGlobs(globs, options = {}) {
  const { globstar = false } = options;
  if (!globstar || globs.length === 0) return join(...globs);
  let joined;
  for (const glob of globs) {
    const path = glob;
    if (path.length > 0)
      if (!joined) joined = path;
      else joined += `\\${path}`;
  }
  if (!joined) return ".";
  return normalizeGlob(joined, { globstar });
}
//#endregion
export { joinGlobs };
