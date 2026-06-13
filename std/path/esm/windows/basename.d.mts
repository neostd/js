//#region src/windows/basename.d.ts
/**
 * Return the last portion of a `path`.
 * Trailing directory separators are ignored, and optional suffix is removed.
 *
 * @example Usage
 * ```ts
 * import { basename } from "@neostd/path/windows/basename";
 * import { equals } from "node:assert/strict";
 *
 * equals(basename("C:\\user\\Documents\\"), "Documents");
 * equals(basename("C:\\user\\Documents\\image.png"), "image.png");
 * equals(basename("C:\\user\\Documents\\image.png", ".png"), "image");
 * equals(basename(new URL("file:///C:/user/Documents/image.png")), "image.png");
 * equals(basename(new URL("file:///C:/user/Documents/image.png"), ".png"), "image");
 * ```
 *
 * @param path The path to extract the name from.
 * @param suffix The suffix to remove from extracted name.
 * @returns The extracted name.
 */
declare function basename(path: string | URL, suffix?: string): string;
//#endregion
export { basename };
