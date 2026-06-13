//#region src/posix/relative.d.ts
/**
 * Return the relative path from `from` to `to` based on current working directory.
 *
 * If `from` and `to` are the same, return an empty string.
 *
 * @example Usage
 * ```ts
 * import { relative } from "@neostd/path/posix/relative";
 * import { equal } from "node:assert/strict";
 *
 * const path = relative("/data/orandea/test/aaa", "/data/orandea/impl/bbb");
 * equal(path, "../../impl/bbb");
 * ```
 *
 * @param from The path to start from.
 * @param to The path to reach.
 * @returns The relative path.
 */
declare function relative(from: string, to: string): string;
//#endregion
export { relative };
