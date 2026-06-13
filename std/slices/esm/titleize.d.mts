import { CharSliceLike } from "./utils.mjs";
import { Tokens } from "./tokens.mjs";

//#region src/titleize.d.ts
/**
 * A set of words that should not be capitalized in title case.
 *
 * Includes common articles ("a", "an", "the"), conjunctions ("and", "or", "but"),
 * and prepositions ("of", "in", "on", "to", etc.).
 *
 * @example
 * ```typescript
 * import { NoCapitalizeWords } from '@neostd/slices/titleize';
 *
 * // Check if a word should not be capitalized
 * NoCapitalizeWords.has("the");  // true
 * NoCapitalizeWords.has("Hello"); // false
 * ```
 */
declare const NoCapitalizeWords: Tokens;
/**
 * Converts a string or character buffer to title case.
 *
 * Title case capitalizes the first letter of each word, with the exception
 * of common articles, conjunctions, and prepositions (defined in {@link NoCapitalizeWords}).
 *
 * The function handles:
 * - camelCase and PascalCase word boundaries
 * - Underscore-separated words (snake_case)
 * - Space-separated words
 * - Unicode characters including accented letters
 *
 * To avoid allocations, the function returns a `Uint32Array` of code points.
 * Use `String.fromCodePoint(...result)` to convert to a string.
 *
 * @param s - The string or character buffer to convert to title case.
 * @returns A new `Uint32Array` containing the title case code points.
 *
 * @example
 * ```typescript
 * import { titleize } from '@neostd/slices/titleize';
 *
 * // Basic usage
 * String.fromCodePoint(...titleize("hello world"));  // "Hello World"
 *
 * // camelCase to title case
 * String.fromCodePoint(...titleize("helloWorld"));   // "Hello World"
 *
 * // snake_case to title case
 * String.fromCodePoint(...titleize("bob_the_king")); // "Bob the King"
 *
 * // PascalCase with articles
 * String.fromCodePoint(...titleize("BobTheKing"));   // "Bob the King"
 *
 * // Unicode support
 * String.fromCodePoint(...titleize("hello wörld"));  // "Hello Wörld"
 * ```
 */
declare function titleize(s: CharSliceLike | string): Uint32Array;
//#endregion
export { NoCapitalizeWords, titleize };
