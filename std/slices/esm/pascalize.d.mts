import { CharBuffer } from "./utils.mjs";

//#region src/pascalize.d.ts
/**
 * Converts a string or character buffer to PascalCase.
 *
 * PascalCase capitalizes the first letter of each word and removes separators.
 * Word boundaries are detected at underscores, hyphens, and spaces.
 *
 * **Important**: This function does NOT detect camelCase word boundaries.
 * Uppercase letters in the middle of a word are converted to lowercase.
 * For example, "helloWorld" becomes "Helloworld", not "HelloWorld".
 *
 * Non-letter, non-digit characters (except separators) are preserved.
 * Digits are preserved but don't trigger capitalization of following letters.
 *
 * @param str - The string or character buffer to convert.
 * @returns A `Uint32Array` containing the PascalCase result.
 *
 * @example
 * ```typescript
 * import { pascalize } from '@neostd/slices/pascalize';
 *
 * // snake_case to PascalCase
 * String.fromCodePoint(...pascalize("get_user_name")); // "GetUserName"
 *
 * // kebab-case to PascalCase
 * String.fromCodePoint(...pascalize("get-user-name")); // "GetUserName"
 *
 * // Space-separated to PascalCase
 * String.fromCodePoint(...pascalize("get user name")); // "GetUserName"
 *
 * // Mixed separators
 * String.fromCodePoint(...pascalize("get_user-name here")); // "GetUserNameHere"
 *
 * // Existing camelCase (note: doesn't preserve word boundaries)
 * String.fromCodePoint(...pascalize("getUserName")); // "Getusername"
 *
 * // Unicode support
 * String.fromCodePoint(...pascalize("hello_wörld")); // "HelloWörld"
 * String.fromCodePoint(...pascalize("größe_öffnung")); // "GrößeÖffnung"
 * ```
 */
declare function pascalize(str: CharBuffer): Uint32Array;
//#endregion
export { pascalize };
