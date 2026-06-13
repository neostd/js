import { n as GlobOptions } from "../glob-to-reg-exp-hiM9A6iV.mjs";

//#region src/posix/join-globs.d.ts
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
declare function joinGlobs(globs: string[], options?: Pick<GlobOptions, "globstar">): string;
//#endregion
export { type GlobOptions, joinGlobs };
