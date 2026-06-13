//#region src/is-empty.d.ts
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
declare function isEmpty(s: string): s is "";
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
declare function isNullOrEmpty(s?: string | null): s is undefined | null | "";
//#endregion
export { isEmpty, isNullOrEmpty };
