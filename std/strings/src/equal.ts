import { equal as sliceEqual, equalFold as sliceEqualFold } from "@neostd/slices/equal";
import type { CharBuffer } from "@neostd/slices/utils";

/**
 * Compares a string with another character buffer using case-sensitive comparison.
 * @param value The string to compare.
 * @param other The other string or character buffer.
 * @returns `true` when both values contain the same characters.
 * @example
 * ```typescript
 * import { equal } from "@neostd/strings";
 *
 * equal("Hello", "Hello"); // true
 * equal("Hello", "hello"); // false
 * ```
 */
export function equal(value: string, other: CharBuffer): boolean {
  return sliceEqual(value, other);
}

/**
 * Compares a string with another character buffer using case-insensitive comparison.
 * @param value The string to compare.
 * @param other The other string or character buffer.
 * @returns `true` when both values contain the same characters after case folding.
 * @example
 * ```typescript
 * import { equalFold } from "@neostd/strings";
 *
 * equalFold("Hello", "hello"); // true
 * ```
 */
export function equalFold(value: string, other: CharBuffer): boolean {
  if (value.length !== other.length) {
    return false;
  }

  return sliceEqualFold(value, other);
}
