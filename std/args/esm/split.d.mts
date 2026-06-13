//#region src/split.d.ts
/**
 * Splits a command-line string into an array of arguments.
 *
 * Handles space-separated arguments, single-quoted strings, double-quoted strings, escaped quotes inside quoted
 * strings, and line continuations with `\` or PowerShell-style backticks.
 *
 * @param value Command-line string to split.
 * @returns Argument tokens.
 *
 * @example
 * ```ts
 * split('git commit -m "initial commit"');
 * // ["git", "commit", "-m", "initial commit"]
 * ```
 */
declare function split(value: string): string[];
//#endregion
export { split };
