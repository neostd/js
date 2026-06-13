import { CharBuffer } from "@neostd/slices/utils";

//#region src/trim.d.ts
/**
 * Trims a single trailing character from a string.
 * @param value The string to trim.
 * @param suffix The code point to remove from the end.
 * @returns The trimmed string.
 * @example
 * ```typescript
 * import { trimEndChar } from "@neostd/strings";
 *
 * trimEndChar("hello.", 46); // "hello"
 * ```
 */
declare function trimEndChar(value: string, suffix: number): string;
/**
 * Trims a trailing character sequence from a string.
 * @param value The string to trim.
 * @param suffix The suffix sequence to remove.
 * @returns The trimmed string.
 * @example
 * ```typescript
 * import { trimEndSlice } from "@neostd/strings";
 *
 * trimEndSlice("hello123", [49, 50, 51]); // "hello"
 * ```
 */
declare function trimEndSlice(value: string, suffix: CharBuffer): string;
/**
 * Trims trailing whitespace or trailing custom characters from a string.
 * @param value The string to trim.
 * @param suffix The optional suffix sequence to remove.
 * @returns The trimmed string.
 * @example
 * ```typescript
 * import { trimEnd } from "@neostd/strings";
 *
 * trimEnd("hello   "); // "hello"
 * trimEnd("hello...", "."); // "hello"
 * ```
 */
declare function trimEnd(value: string, suffix?: CharBuffer): string;
/**
 * Trims a single leading character from a string.
 * @param value The string to trim.
 * @param prefix The code point to remove from the start.
 * @returns The trimmed string.
 * @example
 * ```typescript
 * import { trimStartChar } from "@neostd/strings";
 *
 * trimStartChar(".hello", 46); // "hello"
 * ```
 */
declare function trimStartChar(value: string, prefix: number): string;
/**
 * Trims a leading character sequence from a string.
 * @param value The string to trim.
 * @param prefix The prefix sequence to remove.
 * @returns The trimmed string.
 * @example
 * ```typescript
 * import { trimStartSlice } from "@neostd/strings";
 *
 * trimStartSlice("123hello", [49, 50, 51]); // "hello"
 * ```
 */
declare function trimStartSlice(value: string, prefix: CharBuffer): string;
/**
 * Trims leading whitespace or leading custom characters from a string.
 * @param value The string to trim.
 * @param prefix The optional prefix sequence to remove.
 * @returns The trimmed string.
 * @example
 * ```typescript
 * import { trimStart } from "@neostd/strings";
 *
 * trimStart("   hello"); // "hello"
 * trimStart("///hello", "/"); // "hello"
 * ```
 */
declare function trimStart(value: string, prefix?: CharBuffer): string;
/**
 * Trims a single leading and trailing character from a string.
 * @param value The string to trim.
 * @param char The code point to remove from both ends.
 * @returns The trimmed string.
 * @example
 * ```typescript
 * import { trimChar } from "@neostd/strings";
 *
 * trimChar(".hello.", 46); // "hello"
 * ```
 */
declare function trimChar(value: string, char: number): string;
/**
 * Trims a leading and trailing character sequence from a string.
 * @param value The string to trim.
 * @param chars The character sequence to remove from both ends.
 * @returns The trimmed string.
 * @example
 * ```typescript
 * import { trimSlice } from "@neostd/strings";
 *
 * trimSlice("123hello123", [49, 50, 51]); // "hello"
 * ```
 */
declare function trimSlice(value: string, chars: CharBuffer): string;
/**
 * Trims whitespace or custom characters from both ends of a string.
 * @param value The string to trim.
 * @param chars The optional character sequence to remove from both ends.
 * @returns The trimmed string.
 * @example
 * ```typescript
 * import { trim } from "@neostd/strings";
 *
 * trim("  hello  "); // "hello"
 * trim("##hello##", "#"); // "hello"
 * ```
 */
declare function trim(value: string, chars?: CharBuffer): string;
//#endregion
export {
  trim,
  trimChar,
  trimEnd,
  trimEndChar,
  trimEndSlice,
  trimSlice,
  trimStart,
  trimStartChar,
  trimStartSlice,
};
