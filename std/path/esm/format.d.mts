import { ParsedPath } from "./types.mjs";

//#region src/format.d.ts
/**
 * Generate a path from a {@linkcode ParsedPath} object. It does the
 * opposite of {@linkcode https://jsr.io/@neostd/path/doc/~/parse | parse()}.
 *
 * @example Usage
 * ```ts
 * import { format } from "@neostd/path/format";
 * import { equal } from "node:assert/strict";
 *
 * if (Deno.build.os === "windows") {
 *   equal(format({ dir: "C:\\path\\to", base: "script.ts" }), "C:\\path\\to\\script.ts");
 * } else {
 *   equal(format({ dir: "/path/to/dir", base: "script.ts" }), "/path/to/dir/script.ts");
 * }
 * ```
 *
 * @param pathObject Object with path components.
 * @returns The formatted path.
 */
declare function format(pathObject: Partial<ParsedPath>): string;
//#endregion
export { format };
