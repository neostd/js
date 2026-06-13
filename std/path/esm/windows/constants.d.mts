//#region src/windows/constants.d.ts
/**
 * The character used to separate entries in the PATH environment variable.
 *
 * @example
 * ```typescript
 * import { DELIMITER } from "@neostd/path/windows/constants";
 *
 * "C:\\bin;C:\\Windows".split(DELIMITER);
 * ```
 */
declare const DELIMITER: ";";
/**
 * The character used to separate components of a file path.
 *
 * @example
 * ```typescript
 * import { SEPARATOR } from "@neostd/path/windows/constants";
 *
 * ["tmp", "file.txt"].join(SEPARATOR); // "tmp\\file.txt"
 * ```
 */
declare const SEPARATOR: "\\";
/**
 * A regular expression that matches one or more path separators.
 *
 * @example
 * ```typescript
 * import { SEPARATOR_PATTERN } from "@neostd/path/windows/constants";
 *
 * "tmp\\\\file.txt".split(SEPARATOR_PATTERN); // ["tmp", "file.txt"]
 * ```
 */
declare const SEPARATOR_PATTERN: RegExp;
//#endregion
export { DELIMITER, SEPARATOR, SEPARATOR_PATTERN };
