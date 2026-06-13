//#region src/is-space.d.ts
/**
 * Checks whether every character in a string is whitespace.
 * @param s The string to check.
 * @returns `true` when all characters are whitespace. Empty strings return `true`.
 * @example
 * ```typescript
 * import { isSpace } from "@neostd/strings";
 *
 * isSpace(" \t\n"); // true
 * isSpace(" hello "); // false
 * ```
 */
declare function isSpace(s: string): boolean;
/**
 * Checks whether a value is null, undefined, empty, or only whitespace.
 * @param s The value to check.
 * @returns `true` when `s` has no non-whitespace characters.
 * @example
 * ```typescript
 * import { isNullOrSpace } from "@neostd/strings";
 *
 * isNullOrSpace(undefined); // true
 * isNullOrSpace(" \t"); // true
 * isNullOrSpace("hello"); // false
 * ```
 */
declare function isNullOrSpace(s?: string | null): s is null | undefined | "";
//#endregion
export { isNullOrSpace, isSpace };
