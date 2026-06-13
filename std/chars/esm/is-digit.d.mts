import { t as Char } from "./types-CzHdav0e.mjs";

//#region src/is-digit.d.ts
/**
 * Checks if the given value is a digit.
 *
 * @param char - The value to check.
 * @returns `true` if the value is a digit, `false` otherwise.
 *
 * @example
 * ```typescript
 * import { isDigit } from '@neostd/chars/is-digit';
 *
 * console.log(isDigit('5'.charCodeAt(0))); // Output: true
 * console.log(isDigit('a'.charCodeAt(0))); // Output: false
 * ```
 */
declare function isDigit(char: number): boolean;
/**
 * Determines whether the given character is a digit.
 *
 * @param char The character to check.
 * @returns `true` if the character is a digit; otherwise, `false`.
 *
 * @example
 * ```ts
 * import { isDigitUnsafe } from "@neostd/chars/is-digit";
 *
 * console.log(isDigitUnsafe(0x10FFFF)); // Output: false
 * console.log(isDigitUnsafe(0.32)); // Output: false
 * console.log(isDigitUnsafe(10)); // Output: true
 * ```
 */
declare function isDigitUnsafe(char: Char): boolean;
/**
 * Checks if the character at the specified index in the given string is a digit.
 *
 * @param value - The string to check.
 * @param index - The index of the character to check.
 * @returns `true` if the character at the specified index is a digit, `false` otherwise.
 * @example
 * ```typescript
 * import { isDigitAt } from "@neostd/chars/is-digit";
 *
 * const str = "Hello, world!";
 * const index = 4;
 * const isDigit = isDigitAt(str, index);
 * console.log(isDigit); // Output: false
 *
 * const str1 = "Hello, 123!";
 * const index1 = 8;
 * const isDigit1 = isDigitAt(str1, index1);
 * console.log(isDigit1); // Output: true
 *
 * ```
 */
declare function isDigitAt(value: string, index: number): boolean;
//#endregion
export { isDigit, isDigitAt, isDigitUnsafe };
