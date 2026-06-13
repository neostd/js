import { CharBuffer } from "./utils.mjs";

//#region src/dasherize.d.ts
/**
 * Options for the `dasherize` function.
 */
interface DasherizeOptions {
  /**
   * Convert all characters to uppercase (SCREAMING-KEBAB-CASE).
   * Cannot be used with `preserveCase`.
   */
  screaming?: boolean;
  /**
   * Preserve the original case of characters instead of lowercasing.
   * Cannot be used with `screaming`.
   */
  preserveCase?: boolean;
}
/**
 * Converts a string to kebab-case (dash-separated). Handles camelCase,
 * PascalCase, snake_case, and space-separated input.
 *
 * By default, converts all characters to lowercase. Use options to modify
 * the case behavior.
 *
 * @param value - The string to convert to kebab-case.
 * @param options - Options to control case handling.
 * @returns The kebab-case string as a Uint32Array.
 * @throws {Error} If both `preserveCase` and `screaming` are true.
 *
 * @example Basic conversions
 * ```ts
 * String.fromCodePoint(...dasherize("helloWorld"));  // "hello-world"
 * String.fromCodePoint(...dasherize("HelloWorld"));  // "hello-world"
 * String.fromCodePoint(...dasherize("hello_world"));  // "hello-world"
 * String.fromCodePoint(...dasherize("hello world"));  // "hello-world"
 * ```
 *
 * @example Screaming kebab-case
 * ```ts
 * String.fromCodePoint(...dasherize("helloWorld", { screaming: true }));  // "HELLO-WORLD"
 * ```
 *
 * @example Preserve case
 * ```ts
 * String.fromCodePoint(...dasherize("helloWorld", { preserveCase: true }));  // "hello-World"
 * ```
 *
 * @example With Unicode
 * ```ts
 * String.fromCodePoint(...dasherize("hello wörld"));  // "hello-wörld"
 * String.fromCodePoint(...dasherize("caféLatte"));  // "café-latte"
 * ```
 */
declare function dasherize(value: CharBuffer, options?: DasherizeOptions): Uint32Array;
//#endregion
export { DasherizeOptions, dasherize };
