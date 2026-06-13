import { join } from "./join.mjs";
import "./constants.mjs";
import { normalizeGlob } from "./normalize-glob.mjs";
//#region src/posix/join-globs.ts
/**
 * Like join(), but doesn't collapse "**\/.." when `globstar` is true.
 *
 * @example Usage
 * ```ts
 * import { joinGlobs } from "@neostd/path/posix/join-globs";
 * import { equal } from "node:assert/strict";
 *
 * const path = joinGlobs(["foo", "bar", "**"], { globstar: true });
 * equal(path, "foo/bar/**");
 * ```
 *
 * @param globs The globs to join.
 * @param options The options to use.
 * @returns The joined path.
 */
function joinGlobs(globs, options = {}) {
  const { globstar = false } = options;
  if (!globstar || globs.length === 0) return join(...globs);
  let joined;
  for (const glob of globs) {
    const path = glob;
    if (path.length > 0)
      if (!joined) joined = path;
      else joined += `/${path}`;
  }
  if (!joined) return ".";
  return normalizeGlob(joined, { globstar });
}
//#endregion
export { joinGlobs };
