//#region src/constants.d.ts
/**
 * The character used to separate entries in the PATH environment variable.
 * On Windows, this is `;`. On all other platforms, this is `:`.
 *
 * @example
 * ```typescript
 * import { DELIMITER } from "@neostd/path/constants";
 *
 * process.env.PATH?.split(DELIMITER);
 * ```
 */
declare const DELIMITER: ":" | ";";
/**
 * The character used to separate components of a file path.
 * On Windows, this is `\`. On all other platforms, this is `/`.
 *
 * @example
 * ```typescript
 * import { SEPARATOR } from "@neostd/path/constants";
 *
 * ["tmp", "file.txt"].join(SEPARATOR);
 * ```
 */
declare const SEPARATOR: "/" | "\\";
/**
 * A regular expression that matches one or more path separators.
 *
 * @example
 * ```typescript
 * import { SEPARATOR_PATTERN } from "@neostd/path/constants";
 *
 * "tmp///file.txt".split(SEPARATOR_PATTERN); // ["tmp", "file.txt"]
 * ```
 */
declare const SEPARATOR_PATTERN: RegExp;
//#endregion
export { DELIMITER, SEPARATOR, SEPARATOR_PATTERN };
