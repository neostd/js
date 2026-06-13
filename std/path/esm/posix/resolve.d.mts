//#region src/posix/resolve.d.ts
/**
 * Resolves path segments into a `path`.
 *
 * @example Usage
 * ```ts
 * import { resolve } from "@neostd/path/posix/resolve";
 * import { equal } from "node:assert/strict";
 *
 * const path = resolve("/foo", "bar", "baz/asdf", "quux", "..");
 * equal(path, "/foo/bar/baz/asdf");
 * ```
 *
 * @param pathSegments The path segments to resolve.
 * @returns The resolved path.
 */
declare function resolve(...pathSegments: string[]): string;
//#endregion
export { resolve };
