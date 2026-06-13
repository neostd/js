//#region src/is-null.ts
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
function isNull(s) {
  return s === null;
}
//#endregion
export { isNull };
