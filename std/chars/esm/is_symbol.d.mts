import { t as Char } from "./types-CzHdav0e.mjs";

//#region src/is_symbol.d.ts
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
declare function isSymbol(char: Char): boolean;
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
declare function isSymbolUnsafe(char: Char): boolean;
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
declare function isSymbolAt(str: string, index: number): boolean;
//#endregion
export { isSymbol, isSymbolAt, isSymbolUnsafe };