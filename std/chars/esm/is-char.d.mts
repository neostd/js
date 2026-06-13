//#region src/is-char.d.ts
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
declare function isChar(char: number): boolean;
//#endregion
export { isChar };