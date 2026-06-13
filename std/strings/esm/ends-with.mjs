import { endsWith as endsWith$1, endsWithFold as endsWithFold$1 } from "@neostd/slices/ends-with";
//#region src/ends-with.ts
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
function endsWithFold(value, suffix) {
  if (suffix.length > value.length) return false;
  return endsWithFold$1(value, suffix);
}
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
function endsWith(value, suffix) {
  if (suffix.length > value.length) return false;
  return endsWith$1(value, suffix);
}
//#endregion
export { endsWith, endsWithFold };
