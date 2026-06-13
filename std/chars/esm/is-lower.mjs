import { is16, is32, latin1 } from "./tables/latin1.mjs";
import { Ll } from "./tables/ll.mjs";
//#region src/is-lower.ts
/**
 * Checks if the given value represents a lowercase letter.
 * @param char The char to check.
 * @returns `true` if the value represents a lowercase letter; otherwise, `false`.
 *
 * @example
 * ```ts
 * import { isLower } from "@neostd/chars/is-lower";
 *
 * console.log(isLower(0x61)); // Output: true
 * console.log(isLower(0x41)); // Output: false
 * console.log(isLower(0x10FFFF)); // Output: false
 * console.log(isLower(0.32)); // Output: false
 * ```
 */
function isLower(char) {
  if (Number.isInteger(char) === false || char < 0 || char > 1114111) return false;
  if (char < 256) return (latin1[char] & 64) !== 0;
  if (char <= Ll.R16[Ll.R16.length - 1][1]) return is16(Ll.R16, char);
  if (char >= Ll.R32[0][0]) return is32(Ll.R32, char);
  return false;
}
/**
 * Checks if the given value represents a lowercase letter.
 *
 * @description
 * The function skips the type check and the range check for a small performance boost.
 *
 * @param char The char to check.
 * @returns `true` if the value represents a lowercase letter; otherwise, `false`.
 *
 * @example
 * ```ts
 * import { isLowerUnsafe } from "@neostd/chars/is-lower";
 *
 * console.log(isLowerUnsafe(0x61)); // Output: true
 * console.log(isLowerUnsafe(0x41)); // Output: false
 * console.log(isLowerUnsafe(0x10FFFF)); // Output: false
 * console.log(isLowerUnsafe(0.32)); // Output: false
 * ```
 */
function isLowerUnsafe(char) {
  if (char < 256) return (latin1[char] & 64) !== 0;
  if (char <= Ll.R16[Ll.R16.length - 1][1]) return is16(Ll.R16, char);
  if (char >= Ll.R32[0][0]) return is32(Ll.R32, char);
  return false;
}
/**
 * Checks if the character at the specified index in the given string is a lowercase letter.
 *
 * @param str The string to check.
 * @param index The index of the character to check.
 * @returns `true` if the character at the specified index is a lowercase letter; otherwise, `false`.
 *
 * @example
 * ```ts
 * import { isLowerAt } from "@neostd/chars/is-lower";
 *
 * const str = "Hello, world!";
 * console.log(isLowerAt(str, 5)); // Output: false
 * console.log(isLowerAt(str, 2)); // Output: true
 * console.log(isLowerAt(str, 0)); // Output: false
 * ```
 */
function isLowerAt(str, index) {
  return isLowerUnsafe(str.codePointAt(index) ?? 0);
}
//#endregion
export { isLower, isLowerAt, isLowerUnsafe };
