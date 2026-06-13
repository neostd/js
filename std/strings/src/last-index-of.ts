import {
  lastIndexOf as sliceLastIndexOf,
  lastIndexOfFold as sliceLastIndexOfFold,
} from "@neostd/slices/last-index-of";
import type { CharBuffer } from "@neostd/slices/utils";

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
export function lastIndexOf(
  value: string,
  chars: CharBuffer,
  index = Number.POSITIVE_INFINITY,
): number {
  return sliceLastIndexOf(value, chars, index);
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
export function lastIndexOfFold(
  value: string,
  chars: CharBuffer,
  index = Number.POSITIVE_INFINITY,
): number {
  return sliceLastIndexOfFold(value, chars, index);
}
