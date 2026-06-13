/**
 * Checks whether a value is null.
 * @param s The value to check.
 * @returns `true` when `s` is `null`.
 * @example
 * ```typescript
 * import { isNull } from "@neostd/strings";
 *
 * isNull(null); // true
 * isNull(""); // false
 * ```
 */
export function isNull(s: string | null): s is null {
  return s === null;
}
