import {
  toCharArray as toCodePoints,
  toString as codePointsToString,
  type CharBuffer,
} from "@neostd/slices/utils";

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
export function toCharArray(s: string): Uint32Array {
  return toCodePoints(s);
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
export function toString(buffer: CharBuffer): string {
  return codePointsToString(buffer);
}
