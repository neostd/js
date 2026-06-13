import { equal as equal$1, equalFold as equalFold$1 } from "@neostd/slices/equal";
//#region src/equal.ts
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
function equal(value, other) {
  return equal$1(value, other);
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
function equalFold(value, other) {
  if (value.length !== other.length) return false;
  return equalFold$1(value, other);
}
//#endregion
export { equal, equalFold };
