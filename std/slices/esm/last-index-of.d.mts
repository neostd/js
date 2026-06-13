import { CharBuffer } from "./utils.mjs";

//#region src/last-index-of.d.ts
/**
 * Finds the last occurrence of a substring in a character buffer using
 * case-insensitive (fold) comparison. Searches backwards from the end or
 * the specified index position.
 *
 * Uses Unicode case folding for proper comparison of international characters
 * including accented letters, Greek, Cyrillic, and other scripts.
 *
 * @param value - The character buffer to search in.
 * @param test - The substring to search for.
 * @param index - The index to start searching backwards from (default: 0).
 * @returns The index of the last occurrence, or -1 if not found.
 *
 * @example Basic case-insensitive search
 * ```ts
 * lastIndexOfFold("Hello HELLO hello", "hello");  // Returns 12
 * lastIndexOfFold("ABC abc ABC", "abc");  // Returns 8
 * ```
 *
 * @example With accented characters
 * ```ts
 * lastIndexOfFold("café CAFÉ café", "café");  // Returns 10
 * lastIndexOfFold("über ÜBER", "über");  // Returns 5
 * ```
 *
 * @example With index limit
 * ```ts
 * lastIndexOfFold("foo FOO foo", "foo", 5);  // Returns 4
 * ```
 */
declare function lastIndexOfFold(value: CharBuffer, test: CharBuffer, index?: number): number;
/**
 * Finds the last occurrence of a substring in a character buffer using
 * case-sensitive comparison. Searches backwards from the end or the
 * specified index position.
 *
 * @param value - The character buffer to search in.
 * @param test - The substring to search for.
 * @param index - The index to start searching backwards from (default: Infinity,
 *                meaning search from the end).
 * @returns The index of the last occurrence, or -1 if not found.
 *
 * @example Basic search
 * ```ts
 * lastIndexOf("foo bar foo", "foo");  // Returns 8
 * lastIndexOf("abcabc", "abc");  // Returns 3
 * ```
 *
 * @example Case-sensitive
 * ```ts
 * lastIndexOf("Hello HELLO", "HELLO");  // Returns 6
 * lastIndexOf("Hello HELLO", "hello");  // Returns -1 (case mismatch)
 * ```
 *
 * @example With index limit
 * ```ts
 * lastIndexOf("foo bar foo", "foo", 5);  // Returns 0 (only searches up to index 5)
 * ```
 *
 * @example Not found
 * ```ts
 * lastIndexOf("hello world", "xyz");  // Returns -1
 * lastIndexOf("abc", "abcd");  // Returns -1 (test longer than value)
 * ```
 */
declare function lastIndexOf(value: CharBuffer, test: CharBuffer, index?: number): number;
//#endregion
export { lastIndexOf, lastIndexOfFold };
