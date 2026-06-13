import { indexOf as indexOf$1, indexOfFold as indexOfFold$1 } from "@neostd/slices/index-of";
//#region src/index-of.ts
/**
 * Finds the first index of a character buffer using case-insensitive comparison.
 * @param value The string to search.
 * @param chars The characters to find.
 * @param index The zero-based search start index.
 * @returns The first matching index, or `-1` when no match is found.
 * @example
 * ```typescript
 * import { indexOfFold } from "@neostd/strings";
 *
 * indexOfFold("Hello World", "world"); // 6
 * ```
 */
function indexOfFold(value, chars, index = 0) {
  return indexOfFold$1(value, chars, index);
}
/**
 * Finds the first index of a character buffer using case-sensitive comparison.
 * @param value The string to search.
 * @param chars The characters to find.
 * @param index The zero-based search start index.
 * @returns The first matching index, or `-1` when no match is found.
 * @example
 * ```typescript
 * import { indexOf } from "@neostd/strings";
 *
 * indexOf("Hello World", "World"); // 6
 * indexOf("Hello World", "world"); // -1
 * ```
 */
function indexOf(value, chars, index = 0) {
  return indexOf$1(value, chars, index);
}
//#endregion
export { indexOf, indexOfFold };
