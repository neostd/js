import { n as GlobOptions } from "../glob-to-reg-exp-hiM9A6iV.mjs";

//#region src/windows/join-globs.d.ts
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
declare function joinGlobs(globs: string[], options?: Pick<GlobOptions, "globstar">): string;
//#endregion
export { type GlobOptions, joinGlobs };
