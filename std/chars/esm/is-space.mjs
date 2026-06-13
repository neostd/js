import { is16 } from "./tables/latin1.mjs";
//#region src/is-space.ts
const R16 = [
  [9, 13, 1],
  [32, 133, 101],
  [160, 5760, 5600],
  [8192, 8202, 1],
  [8232, 8233, 1],
  [8239, 8287, 48],
  [12288, 12288, 1],
];
/**
 * Checks if the given character is a whitespace character.
 *
 * @param char - The character to check.
 * @returns `true` if the character is a whitespace character, `false` otherwise.
 * @example
 * ```typescript
 * import { isSpace } from "@neostd/chars";
 *
 * console.log(isSpace(0x20)); // true
 * console.log(isSpace(0x41)); // false
 * console.log(isSpace(0x3000)); // true
 * ```
 */
function isSpace(char) {
  if (!Number.isInteger(char) || char < 1 || char > 1114111) return false;
  if (char < 256)
    return (
      char === 32 ||
      char === 9 ||
      char === 11 ||
      char === 12 ||
      char === 10 ||
      char === 13 ||
      char === 133 ||
      char === 160
    );
  if (char <= R16[R16.length - 1][1]) return is16(R16, char);
  return false;
}
/**
 * Checks if the given character is a whitespace character.
 * @param char The character to check.
 * @returns `true` if the character is a whitespace character, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isSpaceUnsafe } from "@neostd/chars";
 *
 * console.log(isSpaceUnsafe(0x20)); // true
 * console.log(isSpaceUnsafe(0x41)); // false
 * console.log(isSpaceUnsafe(0x3000)); // true
 * ```
 */
function isSpaceUnsafe(char) {
  if (char < 256)
    return (
      char === 32 ||
      char === 9 ||
      char === 11 ||
      char === 12 ||
      char === 10 ||
      char === 13 ||
      char === 133 ||
      char === 160
    );
  if (char <= R16[R16.length - 1][1]) return is16(R16, char);
  return false;
}
/**
 * Checks if the character at the specified index in the given string is a whitespace character.
 *
 * @param value - The string to check.
 * @param index - The index of the character to check.
 * @returns `true` if the character is a whitespace character, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isWhiteSpaceAt } from "@neostd/chars";
 *
 * const str = "Hello, world!";
 * console.log(isSpaceAt(str, 4)); // Output: false
 * console.log(isSpaceAt(str, 6)); // Output: true
 * ```
 */
function isSpaceAt(value, index) {
  return isSpace(value.codePointAt(index) ?? 0);
}
//#endregion
export { isSpace, isSpaceAt, isSpaceUnsafe };
