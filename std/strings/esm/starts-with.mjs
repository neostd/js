import {
  startsWith as startsWith$1,
  startsWithFold as startsWithFold$1,
} from "@neostd/slices/starts-with";
//#region src/starts-with.ts
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
function startsWith(value, prefix) {
  return startsWith$1(value, prefix);
}
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
function startsWithFold(value, prefix) {
  return startsWithFold$1(value, prefix);
}
//#endregion
export { startsWith, startsWithFold };
