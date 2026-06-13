import { toCharSliceLike } from "@neostd/slices/utils";
import {
  trimChar as trimChar$1,
  trimEndChar as trimEndChar$1,
  trimEndSlice as trimEndSlice$1,
  trimSlice as trimSlice$1,
  trimStartChar as trimStartChar$1,
  trimStartSlice as trimStartSlice$1,
} from "@neostd/slices/trim";
//#region src/trim.ts
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
function trimEndChar(value, suffix) {
  const result = trimEndChar$1(value, suffix);
  return String.fromCodePoint(...result);
}
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
function trimEndSlice(value, suffix) {
  const result = trimEndSlice$1(value, suffix);
  return String.fromCodePoint(...result);
}
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
function trimEnd(value, suffix) {
  if (suffix === void 0) return value.trimEnd();
  if (suffix.length === 1) return trimEndChar(value, toCharSliceLike(suffix).at(0) ?? -1);
  return trimEndSlice(value, suffix);
}
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
function trimStartChar(value, prefix) {
  const result = trimStartChar$1(value, prefix);
  return String.fromCodePoint(...result);
}
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
function trimStartSlice(value, prefix) {
  const result = trimStartSlice$1(value, prefix);
  return String.fromCodePoint(...result);
}
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
function trimStart(value, prefix) {
  if (prefix === void 0) return value.trimStart();
  if (prefix.length === 1) return trimStartChar(value, toCharSliceLike(prefix).at(0) ?? -1);
  return trimStartSlice(value, prefix);
}
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
function trimChar(value, char) {
  const result = trimChar$1(value, char);
  return String.fromCodePoint(...result);
}
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
function trimSlice(value, chars) {
  const result = trimSlice$1(value, chars);
  return String.fromCodePoint(...result);
}
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
function trim(value, chars) {
  if (chars === void 0) return value.trim();
  if (chars.length === 1) return trimChar(value, toCharSliceLike(chars).at(0) ?? -1);
  return trimSlice(value, chars);
}
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
