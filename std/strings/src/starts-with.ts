import {
  startsWith as sliceStartsWith,
  startsWithFold as sliceStartsWithFold,
} from "@neostd/slices/starts-with";
import type { CharBuffer } from "@neostd/slices/utils";

/**
 * Checks whether a string starts with a prefix using case-sensitive comparison.
 * @param value The string to check.
 * @param prefix The prefix to match.
 * @returns `true` when `value` starts with `prefix`.
 * @example
 * ```typescript
 * import { startsWith } from "@neostd/strings";
 *
 * startsWith("Hello World", "Hello"); // true
 * startsWith("Hello World", "hello"); // false
 * ```
 */
export function startsWith(value: string, prefix: CharBuffer): boolean {
  return sliceStartsWith(value, prefix);
}

/**
 * Checks whether a string starts with a prefix using case-insensitive comparison.
 * @param value The string to check.
 * @param prefix The prefix to match.
 * @returns `true` when `value` starts with `prefix`.
 * @example
 * ```typescript
 * import { startsWithFold } from "@neostd/strings";
 *
 * startsWithFold("Hello World", "hello"); // true
 * ```
 */
export function startsWithFold(value: string, prefix: CharBuffer): boolean {
  return sliceStartsWithFold(value, prefix);
}
