import { CharBuffer } from "@neostd/slices/utils";

//#region src/ends-with.d.ts
/**
 * Checks whether a string ends with a suffix using case-insensitive comparison.
 * @param value The string to check.
 * @param suffix The suffix to match.
 * @returns `true` when `value` ends with `suffix`.
 * @example
 * ```typescript
 * import { endsWithFold } from "@neostd/strings";
 *
 * endsWithFold("Hello World", "WORLD"); // true
 * ```
 */
declare function endsWithFold(value: string, suffix: CharBuffer): boolean;
/**
 * Checks whether a string ends with a suffix using case-sensitive comparison.
 * @param value The string to check.
 * @param suffix The suffix to match.
 * @returns `true` when `value` ends with `suffix`.
 * @example
 * ```typescript
 * import { endsWith } from "@neostd/strings";
 *
 * endsWith("Hello World", "World"); // true
 * endsWith("Hello World", "world"); // false
 * ```
 */
declare function endsWith(value: string, suffix: CharBuffer): boolean;
//#endregion
export { endsWith, endsWithFold };
