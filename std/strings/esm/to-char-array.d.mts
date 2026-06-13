import { CharBuffer } from "@neostd/slices/utils";

//#region src/to-char-array.d.ts
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
declare function toCharArray(s: string): Uint32Array;
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
declare function toString(buffer: CharBuffer): string;
//#endregion
export { toCharArray, toString };
