import { toCharArray as toCharArray$1, toString as toString$1 } from "@neostd/slices/utils";
//#region src/to-char-array.ts
/**
 * Converts a string to a `Uint32Array` of Unicode code points.
 * @param s The string to convert.
 * @returns A code-point array.
 * @example
 * ```typescript
 * import { toCharArray } from "@neostd/strings";
 *
 * [...toCharArray("abc")]; // [97, 98, 99]
 * ```
 */
function toCharArray(s) {
  return toCharArray$1(s);
}
/**
 * Converts a character buffer to a string.
 * @param buffer The string, array, typed array, or slice-like character buffer.
 * @returns The string value.
 * @example
 * ```typescript
 * import { toString } from "@neostd/strings";
 *
 * toString([97, 98, 99]); // "abc"
 * ```
 */
function toString(buffer) {
  return toString$1(buffer);
}
//#endregion
export { toCharArray, toString };
