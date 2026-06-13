/**
 * Splits a string or character array into substrings.
 * @param str The input string, UTF-8 byte array, or code-point array.
 * @param separator The string or regular expression separator.
 * @param trim Whether to trim results and remove empty entries.
 * @param limit The maximum number of substrings to return.
 * @returns The split substrings.
 * @example
 * ```typescript
 * import { split } from "@neostd/strings";
 *
 * split("a,b,c", ","); // ["a", "b", "c"]
 * split(" a , b , ", ",", true); // ["a", "b"]
 * ```
 */
export function split(
  str: string | Uint8Array | Uint32Array,
  separator: string | RegExp,
  trim = false,
  limit?: number,
): string[] {
  if (str instanceof Uint8Array) {
    str = new TextDecoder().decode(str);
  }

  if (str instanceof Uint32Array) {
    str = String.fromCodePoint(...str);
  }

  const result = str.split(separator, limit);
  if (trim) {
    return result.map((x) => x.trim()).filter((x) => x.length > 0);
  }

  return result;
}
