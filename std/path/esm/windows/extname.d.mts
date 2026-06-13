//#region src/windows/extname.d.ts
/**
 * Return the extension of the `path` with leading period.
 *
 * @example Usage
 * ```ts
 * import { extname } from "@neostd/path/windows/extname";
 * import { equals } from "node:assert/strict";
 *
 * equals(extname("file.ts"), ".ts");
 * equals(extname(new URL("file:///C:/foo/bar/baz.ext")), ".ext");
 * ```
 *
 * @param path The path to get the extension from.
 * @returns The extension of the `path`.
 */
declare function extname(path: string | URL): string;
//#endregion
export { extname };
