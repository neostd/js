import { CharBuffer } from "./utils.mjs";

//#region src/starts-with.d.ts
/**
 * Determines if a character buffer starts with the given prefix using
 * a case-insensitive (Unicode fold) comparison.
 *
 * This function handles Unicode case folding properly, including characters
 * outside the ASCII range like accented letters, Greek, Cyrillic, etc.
 *
 * @param value - The character buffer to check.
 * @param prefix - The prefix to look for.
 * @returns `true` if the buffer starts with the prefix (case-insensitive); otherwise `false`.
 *
 * @example
 * ```typescript
 * import { startsWithFold } from '@neostd/slices/starts-with';
 *
 * startsWithFold("Hello World", "hello");  // true
 * startsWithFold("Hello World", "HELLO");  // true
 * startsWithFold("WÖRLD", "wörld");        // true (handles umlauts)
 * startsWithFold("Hello World", "world");  // false (not at start)
 * ```
 */
declare function startsWithFold(value: CharBuffer, prefix: CharBuffer): boolean;
/**
 * Determines if a character buffer starts with the given prefix using
 * an exact (case-sensitive) comparison.
 *
 * @param value - The character buffer to check.
 * @param prefix - The prefix to look for.
 * @returns `true` if the buffer starts with the exact prefix; otherwise `false`.
 *
 * @example
 * ```typescript
 * import { startsWith } from '@neostd/slices/starts-with';
 *
 * startsWith("Hello World", "Hello");  // true
 * startsWith("Hello World", "hello");  // false (case-sensitive)
 * startsWith("Hello World", "He");     // true
 * startsWith("Hello World", "World");  // false (not at start)
 * startsWith("🎉Party", "🎉");          // true (handles emoji)
 * ```
 */
declare function startsWith(value: CharBuffer, prefix: CharBuffer): boolean;
//#endregion
export { startsWith, startsWithFold };
