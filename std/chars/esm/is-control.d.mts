import { t as Char } from "./types-CzHdav0e.mjs";

//#region src/is-control.d.ts
/**
 * Determines whether the given character is a control character.
 * @param char The character to check.
 * @returns `true` if the character is a control character; otherwise, `false`.'
 *
 * @example
 * ```ts
 * import { IsControl } from "@neostd/chars/is-control";
 *
 * console.log(isControl(0x10FFFF)); // Output: false
 * console.log(isControl(0.32)); // Output: false
 * console.log(isControl(10)); // Output: true
 * ```
 */
declare function isControl(char: Char): boolean;
/**
 * Determines whether the given character is a control character.
 *
 * @description
 * Skips the type check and error handling for a faster execution. It should
 * used when the character is known to be a valid Unicode code point such as
 * calling `codePointAt` on a string.
 *
 * @param char The character to check.
 * @returns `true` if the character is a control character; otherwise, `false`.'
 *
 * @example
 * ```ts
 * import { IsControl } from "@neostd/chars/is-control";
 *
 * console.log(isControl(0x10FFFF)); // Output: false
 * console.log(isControl(0.32)); // Output: false
 * console.log(isControl(10)); // Output: true
 * ```
 */
declare function isControlUnsafe(char: Char): boolean;
/**
 * Determines whether the character at the specified index in the given string is a control character.
 * @param str The input string.
 * @param index The index of the character to check.
 * @returns `true` if the character at the specified index is a control character; otherwise, `false`.
 *
 * @example
 * ```ts
 * import { isControlAt } from "@neostd/chars/is-control";
 *
 * const str = "Hello, world!";
 * const index = 4;
 * const isControl = isControlAt(str, index);
 * console.log(isControl); // Output: false
 * ```
 */
declare function isControlAt(str: string, index: number): boolean;
//#endregion
export { isControl, isControlAt, isControlUnsafe };