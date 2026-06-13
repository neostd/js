import { CharBuffer } from "@neostd/slices/utils";

//#region src/last-index-of.d.ts
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
declare function lastIndexOf(value: string, chars: CharBuffer, index?: number): number;
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
declare function lastIndexOfFold(value: string, chars: CharBuffer, index?: number): number;
//#endregion
export { lastIndexOf, lastIndexOfFold };
