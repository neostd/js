import {
  trimChar as sliceTrimChar,
  trimEndChar as sliceTrimEndChar,
  trimEndSlice as sliceTrimEndSlice,
  trimSlice as sliceTrimSlice,
  trimStartChar as sliceTrimStartChar,
  trimStartSlice as sliceTrimStartSlice,
} from "@neostd/slices/trim";
import { type CharBuffer, toCharSliceLike } from "@neostd/slices/utils";

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
export function trimEndChar(value: string, suffix: number): string {
  const result = sliceTrimEndChar(value, suffix);
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
export function trimEndSlice(value: string, suffix: CharBuffer): string {
  const result = sliceTrimEndSlice(value, suffix);
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
export function trimEnd(value: string, suffix?: CharBuffer): string {
  if (suffix === undefined) {
    return value.trimEnd();
  }

  if (suffix.length === 1) {
    const target = toCharSliceLike(suffix);
    const rune = target.at(0) ?? -1;
    return trimEndChar(value, rune);
  }

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
export function trimStartChar(value: string, prefix: number): string {
  const result = sliceTrimStartChar(value, prefix);
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
export function trimStartSlice(value: string, prefix: CharBuffer): string {
  const result = sliceTrimStartSlice(value, prefix);
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
export function trimStart(value: string, prefix?: CharBuffer): string {
  if (prefix === undefined) {
    return value.trimStart();
  }

  if (prefix.length === 1) {
    const target = toCharSliceLike(prefix);
    const rune = target.at(0) ?? -1;
    return trimStartChar(value, rune);
  }

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
export function trimChar(value: string, char: number): string {
  const result = sliceTrimChar(value, char);
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
export function trimSlice(value: string, chars: CharBuffer): string {
  const result = sliceTrimSlice(value, chars);
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
export function trim(value: string, chars?: CharBuffer): string {
  if (chars === undefined) {
    return value.trim();
  }

  if (chars.length === 1) {
    const target = toCharSliceLike(chars);
    const rune = target.at(0) ?? -1;
    return trimChar(value, rune);
  }

  return trimSlice(value, chars);
}
