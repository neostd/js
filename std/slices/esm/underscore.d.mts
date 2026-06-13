import { CharBuffer } from "./utils.mjs";

//#region src/underscore.d.ts
/**
 * Options for the {@link underscore} function.
 *
 * The `screaming` and `preserveCase` options are mutually exclusive.
 * Using both will throw an error.
 *
 * @example
 * ```typescript
 * import { underscore, type UnderScoreOptions } from '@neostd/slices/underscore';
 *
 * const opts: UnderScoreOptions = { screaming: true };
 * String.fromCodePoint(...underscore("helloWorld", opts)); // "HELLO_WORLD"
 * ```
 */
interface UnderScoreOptions {
  /**
   * If true, all letters are converted to uppercase (SCREAMING_SNAKE_CASE).
   * Cannot be used together with `preserveCase`.
   * @default false
   */
  screaming?: boolean;
  /**
   * If true, the original case of each letter is preserved.
   * Cannot be used together with `screaming`.
   * @default false
   */
  preserveCase?: boolean;
}
/**
 * Converts a string or character buffer to underscore_case (snake_case).
 *
 * Word boundaries are detected at:
 * - Transitions from lowercase to uppercase letters (camelCase/PascalCase)
 * - Space characters, hyphens (`-`), and underscores (`_`)
 *
 * Non-letter, non-digit characters are stripped from the output.
 * Consecutive separators are collapsed into a single underscore.
 * Leading and trailing separators are removed.
 *
 * @param slice - The string or character buffer to convert.
 * @param options - Optional settings for case handling.
 * @returns A `Uint32Array` containing the underscore_case result.
 * @throws {Error} If both `preserveCase` and `screaming` options are true.
 *
 * @example
 * ```typescript
 * import { underscore } from '@neostd/slices/underscore';
 *
 * // camelCase to snake_case
 * String.fromCodePoint(...underscore("getUserName")); // "get_user_name"
 *
 * // PascalCase to snake_case
 * String.fromCodePoint(...underscore("GetUserName")); // "get_user_name"
 *
 * // Space-separated to snake_case
 * String.fromCodePoint(...underscore("get user name")); // "get_user_name"
 *
 * // Hyphen-separated to snake_case
 * String.fromCodePoint(...underscore("get-user-name")); // "get_user_name"
 *
 * // SCREAMING_SNAKE_CASE
 * String.fromCodePoint(...underscore("getUserName", { screaming: true })); // "GET_USER_NAME"
 *
 * // Preserve original case
 * String.fromCodePoint(...underscore("getUserName", { preserveCase: true })); // "get_User_Name"
 *
 * // Unicode support
 * String.fromCodePoint(...underscore("helloWörld")); // "hello_wörld"
 * String.fromCodePoint(...underscore("helloWörld", { screaming: true })); // "HELLO_WÖRLD"
 * ```
 */
declare function underscore(slice: CharBuffer, options?: UnderScoreOptions): Uint32Array;
//#endregion
export { UnderScoreOptions, underscore };
