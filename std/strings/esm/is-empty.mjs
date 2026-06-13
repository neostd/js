//#region src/is-empty.ts
/**
 * Checks whether a string is empty.
 * @param s The string to check.
 * @returns `true` when `s` is `""`.
 * @example
 * ```typescript
 * import { isEmpty } from "@neostd/strings";
 *
 * isEmpty(""); // true
 * isEmpty(" "); // false
 * ```
 */
function isEmpty(s) {
  return s.length === 0;
}
/**
 * Checks whether a value is null, undefined, or an empty string.
 * @param s The value to check.
 * @returns `true` when `s` is `null`, `undefined`, or `""`.
 * @example
 * ```typescript
 * import { isNullOrEmpty } from "@neostd/strings";
 *
 * isNullOrEmpty(null); // true
 * isNullOrEmpty("hello"); // false
 * ```
 */
function isNullOrEmpty(s) {
  return s === null || s === void 0 || s.length === 0;
}
//#endregion
export { isEmpty, isNullOrEmpty };
