//#region src/posix/dirname.d.ts
/**
 * Return the directory path of a `path`.
 *
 * @example Usage
 * ```ts
 * import { dirname } from "@neostd/path/posix/dirname";
 * import { equal } from "node:assert/strict";
 *
 * equal(dirname("/home/user/Documents/"), "/home/user");
 * equal(dirname("/home/user/Documents/image.png"), "/home/user/Documents");
 * equal(dirname("https://deno.land/std/path/index.ts"), "https://deno.land/std/path");
 * ```
 *
 * @example Working with URLs
 *
 * ```ts
 * import { dirname } from "@neostd/path/posix/dirname";
 * import { equal } from "node:assert/strict";
 *
 * equal(dirname("https://deno.land/std/path/index.ts"), "https://deno.land/std/path");
 * equal(dirname("https://deno.land/std/path/index.ts?a=b"), "https://deno.land/std/path");
 * equal(dirname("https://deno.land/std/path/index.ts#header"), "https://deno.land/std/path");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `dirname` from `@neostd/path/posix/unstable-dirname`.
 *
 * @param path The path to get the directory from.
 * @returns The directory path.
 */
declare function dirname(path: string | URL): string;
//#endregion
export { dirname };
