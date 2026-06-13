import { isSpaceAt } from "@neostd/chars/is-space";
//#region src/is-space.ts
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
function isSpace(s) {
  for (let i = 0; i < s.length; i++) if (!isSpaceAt(s, i)) return false;
  return true;
}
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
function isNullOrSpace(s) {
  if (s === null || s === void 0 || s.length === 0) return true;
  for (let i = 0; i < s.length; i++) if (!isSpaceAt(s, i)) return false;
  return true;
}
//#endregion
export { isNullOrSpace, isSpace };
