import {
  lastIndexOf as lastIndexOf$1,
  lastIndexOfFold as lastIndexOfFold$1,
} from "@neostd/slices/last-index-of";
//#region src/last-index-of.ts
/**
 * Finds the last index of a character buffer using case-sensitive comparison.
 * @param value The string to search.
 * @param chars The characters to find.
 * @param index The zero-based search end index.
 * @returns The last matching index, or `-1` when no match is found.
 * @example
 * ```typescript
 * import { lastIndexOf } from "@neostd/strings";
 *
 * lastIndexOf("hello world", "o"); // 7
 * lastIndexOf("hello world", "o", 6); // 4
 * ```
 */
function lastIndexOf(value, chars, index = Number.POSITIVE_INFINITY) {
  return lastIndexOf$1(value, chars, index);
}
/**
 * Finds the last index of a character buffer using case-insensitive comparison.
 * @param value The string to search.
 * @param chars The characters to find.
 * @param index The zero-based search end index.
 * @returns The last matching index, or `-1` when no match is found.
 * @example
 * ```typescript
 * import { lastIndexOfFold } from "@neostd/strings";
 *
 * lastIndexOfFold("Hello WORLD", "O"); // 7
 * ```
 */
function lastIndexOfFold(value, chars, index = Number.POSITIVE_INFINITY) {
  return lastIndexOfFold$1(value, chars, index);
}
//#endregion
export { lastIndexOf, lastIndexOfFold };
