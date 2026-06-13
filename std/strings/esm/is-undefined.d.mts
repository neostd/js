//#region src/is-undefined.d.ts
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
declare function isUndefined(s: string | undefined): s is undefined;
//#endregion
export { isUndefined };
