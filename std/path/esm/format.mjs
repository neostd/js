import { isWindows } from "./os.mjs";
import { format as format$1 } from "./posix/format.mjs";
import { format as format$2 } from "./windows/format.mjs";
//#region src/format.ts
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
function format(pathObject) {
  return isWindows ? format$2(pathObject) : format$1(pathObject);
}
//#endregion
export { format };
