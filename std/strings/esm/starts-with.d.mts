import { CharBuffer } from "@neostd/slices/utils";

//#region src/starts-with.d.ts
/**
 * Checks whether a string starts with a prefix using case-sensitive comparison.
 * @param value The string to check.
 * @param prefix The prefix to match.
 * @returns `true` when `value` starts with `prefix`.
 * @example
 * ```typescript
 * import { startsWith } from "@neostd/strings";
 *
 * startsWith("Hello World", "Hello"); // true
 * startsWith("Hello World", "hello"); // false
 * ```
 */
declare function startsWith(value: string, prefix: CharBuffer): boolean;
/**
 * Checks whether a string starts with a prefix using case-insensitive comparison.
 * @param value The string to check.
 * @param prefix The prefix to match.
 * @returns `true` when `value` starts with `prefix`.
 * @example
 * ```typescript
 * import { startsWithFold } from "@neostd/strings";
 *
 * startsWithFold("Hello World", "hello"); // true
 * ```
 */
declare function startsWithFold(value: string, prefix: CharBuffer): boolean;
//#endregion
export { startsWith, startsWithFold };
