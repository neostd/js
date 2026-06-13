//#region src/posix/join.d.ts
/**
 * Join all given a sequence of `paths`,then normalizes the resulting path.
 *
 * @example Usage
 * ```ts
 * import { join } from "@neostd/path/posix/join";
 * import { equal } from "node:assert/strict";
 *
 * const path = join("/foo", "bar", "baz/asdf", "quux", "..");
 * equal(path, "/foo/bar/baz/asdf");
 * ```
 *
 * @example Working with URLs
 * ```ts
 * import { join } from "@neostd/path/posix/join";
 * import { equal } from "node:assert/strict";
 *
 * const url = new URL("https://deno.land");
 * url.pathname = join("std", "path", "index.ts");
 * equal(url.href, "https://deno.land/std/path/index.ts");
 *
 * url.pathname = join("//std", "path/", "/index.ts");
 * equal(url.href, "https://deno.land/std/path/index.ts");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `join` from `@neostd/path/posix/unstable-join`.
 *
 * @param paths The paths to join.
 * @returns The joined path.
 */
declare function join(path?: URL | string, ...paths: string[]): string;
//#endregion
export { join };
