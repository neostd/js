import { CharBuffer } from "@neostd/slices/utils";

//#region src/equal.d.ts
/**
 * Compares a string with another character buffer using case-sensitive comparison.
 * @param value The string to compare.
 * @param other The other string or character buffer.
 * @returns `true` when both values contain the same characters.
 * @example
 * ```typescript
 * import { equal } from "@neostd/strings";
 *
 * equal("Hello", "Hello"); // true
 * equal("Hello", "hello"); // false
 * ```
 */
declare function equal(value: string, other: CharBuffer): boolean;
/**
 * Compares a string with another character buffer using case-insensitive comparison.
 * @param value The string to compare.
 * @param other The other string or character buffer.
 * @returns `true` when both values contain the same characters after case folding.
 * @example
 * ```typescript
 * import { equalFold } from "@neostd/strings";
 *
 * equalFold("Hello", "hello"); // true
 * ```
 */
declare function equalFold(value: string, other: CharBuffer): boolean;
//#endregion
export { equal, equalFold };
