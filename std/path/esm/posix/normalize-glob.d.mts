import { n as GlobOptions } from "../glob-to-reg-exp-hiM9A6iV.mjs";

//#region src/posix/normalize-glob.d.ts
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
declare function normalizeGlob(glob: string, options?: Pick<GlobOptions, "globstar">): string;
//#endregion
export { type GlobOptions, normalizeGlob };
