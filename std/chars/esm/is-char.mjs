//#region src/is-char.ts
/**
 * Determines whether the given value is a valid Unicode character.
 * @param char The value to check.
 * @returns `true` if the value is a valid Unicode character; otherwise, `false`.
 * @example
 * ```ts
 * import { isChar } from "@neostd/chars/is-char";
 *
 * console.log(isChar(0x1F600)); // Output: true
 * console.log(isChar(0x110000)); // Output: false
 * console.log(isChar(0x10FFFF)); // Output: true
 * console.log(isChar(0.32)); // Output: false
 * ```
 */
function isChar(char) {
  return Number.isInteger(char) && char >= 0 && char <= 1114111;
}
//#endregion
export { isChar };
