import { n as GlobOptions } from "../glob-to-reg-exp-hiM9A6iV.mjs";

//#region src/windows/normalize-glob.d.ts
/**
 * Like normalize(), but doesn't collapse "**\/.." when `globstar` is true.
 *
 * @example Usage
 * ```ts
 * import { normalizeGlob } from "@neostd/path/windows/normalize-glob";
 * import { equal } from "node:assert/strict";
 *
 * const normalized = normalizeGlob("**\\foo\\..\\bar", { globstar: true });
 * equal(normalized, "**\\bar");
 * ```
 *
 * @param glob The glob pattern to normalize.
 * @param options The options for glob pattern.
 * @throws Error if the glob contains invalid characters.
 * @returns The normalized glob pattern.
 */
declare function normalizeGlob(glob: string, options?: Pick<GlobOptions, "globstar">): string;
//#endregion
export { type GlobOptions, normalizeGlob };
