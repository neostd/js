import { indexOf as sliceIndexOf, indexOfFold as sliceIndexOfFold } from "@neostd/slices/index-of";
import type { CharBuffer } from "@neostd/slices/utils";

/**
 * Finds the first index of a character buffer using case-insensitive comparison.
 * @param value The string to search.
 * @param chars The characters to find.
 * @param index The zero-based search start index.
 * @returns The first matching index, or `-1` when no match is found.
 * @example
 * ```typescript
 * import { indexOfFold } from "@neostd/strings";
 *
 * indexOfFold("Hello World", "world"); // 6
 * ```
 */
export function indexOfFold(value: string, chars: CharBuffer, index = 0): number {
  return sliceIndexOfFold(value, chars, index);
}

/**
 * Finds the first index of a character buffer using case-sensitive comparison.
 * @param value The string to search.
 * @param chars The characters to find.
 * @param index The zero-based search start index.
 * @returns The first matching index, or `-1` when no match is found.
 * @example
 * ```typescript
 * import { indexOf } from "@neostd/strings";
 *
 * indexOf("Hello World", "World"); // 6
 * indexOf("Hello World", "world"); // -1
 * ```
 */
export function indexOf(value: string, chars: CharBuffer, index = 0): number {
  return sliceIndexOf(value, chars, index);
}
