/**
 * Checks whether a value is undefined.
 * @param s The value to check.
 * @returns `true` when `s` is `undefined`.
 * @example
 * ```typescript
 * import { isUndefined } from "@neostd/strings";
 *
 * isUndefined(undefined); // true
 * isUndefined(""); // false
 * ```
 */
export function isUndefined(s: string | undefined): s is undefined {
  return s === undefined;
}
