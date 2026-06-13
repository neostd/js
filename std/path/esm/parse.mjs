import { isWindows } from "./os.mjs";
import { parse as parse$1 } from "./posix/parse.mjs";
import { parse as parse$2 } from "./windows/parse.mjs";
//#region src/parse.ts
/**
 * Return an object containing the parsed components of the path.
 *
 * Use {@linkcode https://jsr.io/@neostd/path/doc/~/format | format()} to reverse
 * the result.
 *
 * @example Usage
 * ```ts
 * import { parse } from "@neostd/path/parse";
 * import { equal } from "node:assert/strict";
 *
 * if (Deno.build.os === "windows") {
 *   const parsedPathObj = parse("C:\\path\\to\\script.ts");
 *   equal(parsedPathObj.root, "C:\\");
 *   equal(parsedPathObj.dir, "C:\\path\\to");
 *   equal(parsedPathObj.base, "script.ts");
 *   equal(parsedPathObj.ext, ".ts");
 *   equal(parsedPathObj.name, "script");
 * } else {
 *   const parsedPathObj = parse("/path/to/dir/script.ts");
 *   parsedPathObj.root; // "/"
 *   parsedPathObj.dir; // "/path/to/dir"
 *   parsedPathObj.base; // "script.ts"
 *   parsedPathObj.ext; // ".ts"
 *   parsedPathObj.name; // "script"
 * }
 * ```
 *
 * @param path Path to process
 * @returns An object with the parsed path components.
 */
function parse(path) {
  return isWindows ? parse$2(path) : parse$1(path);
}
//#endregion
export { parse };
