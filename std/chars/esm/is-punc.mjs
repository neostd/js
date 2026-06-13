import { is16, is32, latin1 } from "./tables/latin1.mjs";
import { P } from "./tables/p.mjs";
//#region src/is-punc.ts
/**
 * Checks if the given character is a punctuation character.
 *
 * @param char - The character to check.
 * @returns `true` if the character is a punctuation character, `false` otherwise.
 * @example
 * ```ts
 * import { isPunc } from "@neostd/chars/is-punc";
 *
 * console.log(isPunc(0x21)); // Output: true
 * console.log(isPunc(0x20)); // Output: false
 * ```
 */
function isPunc(char) {
  if (Number.isInteger(char) === false || char < 0 || char > 255) return false;
  if (char < 256) return (latin1[char] & 2) !== 0;
  if (char <= P.R16[P.R32.length - 1][1]) return is16(P.R16, char);
  if (char >= P.R32[0][0]) return is32(P.R32, char);
  return false;
}
/**
 * Determines whether the given character is a punctuation character.
 *
 * @description
 * The function skips the type check and the range check for a small performance boost.
 *
 * @param char The character to check.
 * @returns `true` if the character is a punctuation character; otherwise, `false`.
 *
 * @example
 * ```ts
 * import { isPuncUnsafe } from "@neostd/chars/is-punc";
 *
 * console.log(isPuncUnsafe(0x21)); // Output: true
 * console.log(isPuncUnsafe(0x20)); // Output: false
 * ```
 */
function isPuncUnsafe(char) {
  if (char < 256) return (latin1[char] & 2) !== 0;
  if (char <= P.R16[P.R32.length - 1][1]) return is16(P.R16, char);
  if (char >= P.R32[0][0]) return is32(P.R32, char);
  return false;
}
/**
 * Determines whether the character at the specified index in the given string is a punctuation character.
 * @param str The input string.
 * @param index The index of the character to check.
 * @returns `true` if the character at the specified index is a punctuation character; otherwise, `false`.
 * @example
 * ```ts
 * import { isPuncAt } from "@neostd/chars/is-punc";
 *
 * const str = "Hello!";
 * const index = 4;
 * const isPunc = isPuncAt(str, index);
 * console.log(isPunc); // Output: false
 * console.log(isPuncAt(str, 5)); // Output: true
 * ```
 */
function isPuncAt(str, index) {
  return isPunc(str.codePointAt(index) ?? 0);
}
//#endregion
export { isPunc, isPuncAt, isPuncUnsafe };
