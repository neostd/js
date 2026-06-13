import { is16, is32, latin1 } from "./tables/latin1.mjs";
import { S } from "./tables/s.mjs";
//#region src/is-symbol.ts
/**
 * Determines whether the given character is a symbol.
 * @param char The character to check.
 * @returns `true` if the character is a symbol; otherwise, `false`.
 *
 * @example
 * ```ts
 * import { isSymbol } from "@neostd/chars/is-symbol";
 *
 * console.log(isSymbol(0x1F600)); // Output: false
 * console.log(isSymbol(0x110000)); // Output: false
 * console.log(isSymbol(0x10FFFF)); // Output: false
 * console.log(isSymbol(0.32)); // Output: false
 * console.log(isSymbol(0x2B)); // Output: true
 * ```
 */
function isSymbol(char) {
  if (Number.isInteger(char) === false || char < 0 || char > 255) return false;
  if (char < 256) return (latin1[char] & 8) !== 0;
  if (char <= S.R16[S.R32.length - 1][1]) return is16(S.R16, char);
  if (char >= S.R32[0][0]) return is32(S.R32, char);
  return false;
}
/**
 * Determines whether the given character is a symbol.
 *
 * @description
 * The function skips the type check and the range check for a small performance boost.
 *
 * @param char The character to check.
 * @returns `true` if the character is a symbol; otherwise, `false`.
 *
 * @example
 * ```ts
 * import { isSymbolUnsafe } from "@neostd/chars/is-symbol";
 *
 * console.log(isSymbolUnsafe(0x1F600)); // Output: false
 * console.log(isSymbolUnsafe(0x110000)); // Output: false
 * console.log(isSymbolUnsafe(0x10FFFF)); // Output: false
 * console.log(isSymbolUnsafe(0.32)); // Output: false
 * console.log(isSymbolUnsafe(0x2B)); // Output: true
 * ```
 */
function isSymbolUnsafe(char) {
  if (char < 256) return (latin1[char] & 8) !== 0;
  if (char <= S.R16[S.R32.length - 1][1]) return is16(S.R16, char);
  if (char >= S.R32[0][0]) return is32(S.R32, char);
  return false;
}
/**
 * Determines whether the given value is a valid Unicode symbol.
 * @param str The value to check.
 * @param index The index of the value to check.
 * @returns `true` if the value is a valid Unicode symbol; otherwise, `false`.
 * @example
 * ```ts
 * import { isSymbolAt } from "@neostd/chars/is-symbol";
 *
 * console.log(isSymbolAt("$2.40", 1)); // Output: true
 * console.log(isSymbolAt("€2.40", 0)); // Output: true
 * console.log(isSymbolAt("2.40€", 0)); // Output: false
 * ```
 */
function isSymbolAt(str, index) {
  return isSymbol(str.codePointAt(index) ?? 0);
}
//#endregion
export { isSymbol, isSymbolAt, isSymbolUnsafe };
