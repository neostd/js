//#region src/posix/basename.d.ts
/**
 * Return the last portion of a `path`.
 * Trailing directory separators are ignored, and optional suffix is removed.
 *
 * @example Usage
 * ```ts
 * import { basename } from "@neostd/path/posix/basename";
 * import { equal } from "node:assert/strict";
 *
 * equal(basename("/home/user/Documents/"), "Documents");
 * equal(basename("/home/user/Documents/image.png"), "image.png");
 * equal(basename("/home/user/Documents/image.png", ".png"), "image");
 * ```
 *
 * @example Working with URLs
 *
 * Note: This function doesn't automatically strip hash and query parts from
 * URLs. If your URL contains a hash or query, remove them before passing the
 * URL to the function. This can be done by passing the URL to `new URL(url)`,
 * and setting the `hash` and `search` properties to empty strings.
 *
 * ```ts
 * import { basename } from "@neostd/path/posix/basename";
 * import { equal } from "node:assert/strict";
 *
 * equal(basename("https://deno.land/std/path/index.ts"), "index.ts");
 * equal(basename("https://deno.land/std/path/index.ts", ".ts"), "mod");
 * equal(basename("https://deno.land/std/path/index.ts?a=b"), "index.ts?a=b");
 * equal(basename("https://deno.land/std/path/index.ts#header"), "index.ts#header");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `basename` from `@neostd/path/posix/unstable-basename`.
 *
 * @param path The path to extract the name from.
 * @param suffix The suffix to remove from extracted name.
 * @returns The extracted name.
 */
declare function basename(path: string | URL, suffix?: string): string;
//#endregion
export { basename };
