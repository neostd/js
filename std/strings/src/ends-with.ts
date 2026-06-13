import {
  endsWith as sliceEndsWith,
  endsWithFold as sliceEndsWithFold,
} from "@neostd/slices/ends-with";
import type { CharBuffer } from "@neostd/slices/utils";

/**
 * Checks whether a string ends with a suffix using case-insensitive comparison.
 * @param value The string to check.
 * @param suffix The suffix to match.
 * @returns `true` when `value` ends with `suffix`.
 * @example
 * ```typescript
 * import { endsWithFold } from "@neostd/strings";
 *
 * endsWithFold("Hello World", "WORLD"); // true
 * ```
 */
export function endsWithFold(value: string, suffix: CharBuffer): boolean {
  if (suffix.length > value.length) {
    return false;
  }

  return sliceEndsWithFold(value, suffix);
}

/**
 * Checks whether a string ends with a suffix using case-sensitive comparison.
 * @param value The string to check.
 * @param suffix The suffix to match.
 * @returns `true` when `value` ends with `suffix`.
 * @example
 * ```typescript
 * import { endsWith } from "@neostd/strings";
 *
 * endsWith("Hello World", "World"); // true
 * endsWith("Hello World", "world"); // false
 * ```
 */
export function endsWith(value: string, suffix: CharBuffer): boolean {
  if (suffix.length > value.length) {
    return false;
  }

  return sliceEndsWith(value, suffix);
}
