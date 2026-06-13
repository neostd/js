//#region src/join.d.ts
/**
 * Joins command arguments into a Windows-compatible command string.
 *
 * Arguments containing spaces or double quotes are wrapped in double quotes. Backslashes before quotes are escaped using
 * Windows command-line quoting rules.
 *
 * @param args Command arguments to join.
 * @returns A Windows-compatible command string.
 *
 * @example
 * ```ts
 * windowsJoin(["cmd", "C:\\Program Files\\app.exe"]);
 * // 'cmd "C:\\Program Files\\app.exe"'
 * ```
 */
declare function windowsJoin(args: string[]): string;
/**
 * Joins command arguments into a Unix-compatible command string.
 *
 * Arguments containing shell-special characters are wrapped in double quotes. Dollar signs, backticks, double quotes,
 * and backslashes are escaped inside quoted arguments.
 *
 * @param args Command arguments to join.
 * @returns A Unix-compatible command string.
 *
 * @example
 * ```ts
 * unixJoin(["echo", "$HOME"]);
 * // 'echo "\\$HOME"'
 * ```
 */
declare function unixJoin(args: string[]): string;
/**
 * Joins command arguments into a platform-appropriate command string.
 *
 * Uses {@linkcode windowsJoin} on Windows and {@linkcode unixJoin} elsewhere.
 *
 * @param args Command arguments to join.
 * @returns A command string escaped for the current platform.
 */
declare function join(args: string[]): string;
//#endregion
export { join, unixJoin, windowsJoin };
