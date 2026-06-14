//#region src/styles.d.ts
/** RGB color components used by the 24-bit color helpers. */
interface Rgb {
  r: number;
  g: number;
  b: number;
}
/**
 * Enables or disables ANSI styling globally for this module.
 *
 * @param value `true` to enable color output, `false` to disable it.
 */
declare function setColorEnabled(value: boolean): void;
/**
 * Returns whether ANSI styling is currently enabled.
 *
 * @returns `true` when ANSI styling is enabled.
 */
declare function isColorEnabled(): boolean;
/**
 * Applies one or more ANSI style functions to a string.
 *
 * @example Usage
 * ```ts
 * import { apply, blue, bold } from "@neostd/ansi";
 *
 * apply("hello", bold, blue);
 * ```
 *
 * @param str The string to style.
 * @param styles Style functions to apply in order.
 * @returns The styled string, or the original string when colors are disabled.
 */
declare function apply(str: string, ...styles: ((str: string) => string)[]): string;
/** Resets all ANSI styling for the provided string. */
declare function reset(str: string): string;
/** Applies bold ANSI styling. */
declare function bold(str: string): string;
/** Applies dim ANSI styling. */
declare function dim(str: string): string;
/** Applies italic ANSI styling. */
declare function italic(str: string): string;
/** Applies underline ANSI styling. */
declare function underline(str: string): string;
/** Applies inverse ANSI styling. */
declare function inverse(str: string): string;
/** Hides the string using ANSI hidden styling. */
declare function hidden(str: string): string;
/** Applies strikethrough ANSI styling. */
declare function strikethrough(str: string): string;
/** Applies the black foreground color. */
declare function black(str: string): string;
/** Applies the red foreground color. */
declare function red(str: string): string;
/** Applies the green foreground color. */
declare function green(str: string): string;
/** Applies the yellow foreground color. */
declare function yellow(str: string): string;
/** Applies the blue foreground color. */
declare function blue(str: string): string;
/** Applies the magenta foreground color. */
declare function magenta(str: string): string;
/** Applies the cyan foreground color. */
declare function cyan(str: string): string;
/** Applies the white foreground color. */
declare function white(str: string): string;
/** Alias of `brightBlack()`. */
declare function gray(str: string): string;
/** Applies the bright black foreground color. */
declare function brightBlack(str: string): string;
/** Applies the bright red foreground color. */
declare function brightRed(str: string): string;
/** Applies the bright green foreground color. */
declare function brightGreen(str: string): string;
/** Applies the bright yellow foreground color. */
declare function brightYellow(str: string): string;
/** Applies the bright blue foreground color. */
declare function brightBlue(str: string): string;
/** Applies the bright magenta foreground color. */
declare function brightMagenta(str: string): string;
/** Applies the bright cyan foreground color. */
declare function brightCyan(str: string): string;
/** Applies the bright white foreground color. */
declare function brightWhite(str: string): string;
/** Applies the black background color. */
declare function bgBlack(str: string): string;
/** Applies the red background color. */
declare function bgRed(str: string): string;
/** Applies the green background color. */
declare function bgGreen(str: string): string;
/** Applies the yellow background color. */
declare function bgYellow(str: string): string;
/** Applies the blue background color. */
declare function bgBlue(str: string): string;
/** Applies the magenta background color. */
declare function bgMagenta(str: string): string;
/** Applies the cyan background color. */
declare function bgCyan(str: string): string;
/** Applies the white background color. */
declare function bgWhite(str: string): string;
/** Applies the bright black background color. */
declare function bgBrightBlack(str: string): string;
/** Applies the bright red background color. */
declare function bgBrightRed(str: string): string;
/** Applies the bright green background color. */
declare function bgBrightGreen(str: string): string;
/** Applies the bright yellow background color. */
declare function bgBrightYellow(str: string): string;
/** Applies the bright blue background color. */
declare function bgBrightBlue(str: string): string;
/** Applies the bright magenta background color. */
declare function bgBrightMagenta(str: string): string;
/** Applies the bright cyan background color. */
declare function bgBrightCyan(str: string): string;
/** Applies the bright white background color. */
declare function bgBrightWhite(str: string): string;
/**
 * Applies an 8-bit ANSI foreground color.
 *
 * @param str The string to style.
 * @param color The 8-bit ANSI palette value.
 * @returns The styled string.
 */
declare function rgb8(str: string, color: number): string;
/**
 * Converts a 24-bit color to the nearest 8-bit ANSI foreground color and
 * applies it.
 *
 * @param str The string to style.
 * @param color The 24-bit color number or RGB object.
 * @returns The styled string.
 */
declare function rgb24To8(str: string, color: number | Rgb): string;
/**
 * Applies an 8-bit ANSI background color.
 *
 * @param str The string to style.
 * @param color The 8-bit ANSI palette value.
 * @returns The styled string.
 */
declare function bgRgb8(str: string, color: number): string;
/**
 * Applies a 24-bit ANSI foreground color.
 *
 * @param str The string to style.
 * @param color The 24-bit color number or RGB object.
 * @returns The styled string.
 */
declare function rgb24(str: string, color: number | Rgb): string;
/**
 * Applies a 24-bit ANSI background color.
 *
 * @param str The string to style.
 * @param color The 24-bit color number or RGB object.
 * @returns The styled string.
 */
declare function bgRgb24(str: string, color: number | Rgb): string;
/**
 * Removes ANSI escape sequences from a string.
 *
 * @param string The string that may contain ANSI escape sequences.
 * @returns The string with ANSI escape sequences removed.
 */
declare function stripAnsiCode(string: string): string;
/**
 * Creates a foreground color helper that adapts to the active ANSI mode.
 *
 * @param trueColor The 24-bit color to use in truecolor terminals.
 * @param color256 The 8-bit palette color to use in 256-color terminals.
 * @param color The 4-bit fallback color helper.
 * @returns A style function that applies the best available foreground color.
 */
declare function defineColor(trueColor: number | Rgb, color256: number, color: (str: string) => string): (str: string) => string;
/**
 * Creates a background color helper that adapts to the active ANSI mode.
 *
 * @param trueColor The 24-bit color to use in truecolor terminals.
 * @param color256 The 8-bit palette color to use in 256-color terminals.
 * @param color The 4-bit fallback background color helper.
 * @returns A style function that applies the best available background color.
 */
declare function defineBgColor(trueColor: number | Rgb, color256: number, color: (str: string) => string): (str: string) => string;
//#endregion
export { Rgb, apply, bgBlack, bgBlue, bgBrightBlack, bgBrightBlue, bgBrightCyan, bgBrightGreen, bgBrightMagenta, bgBrightRed, bgBrightWhite, bgBrightYellow, bgCyan, bgGreen, bgMagenta, bgRed, bgRgb24, bgRgb8, bgWhite, bgYellow, black, blue, bold, brightBlack, brightBlue, brightCyan, brightGreen, brightMagenta, brightRed, brightWhite, brightYellow, cyan, defineBgColor, defineColor, dim, gray, green, hidden, inverse, isColorEnabled, italic, magenta, red, reset, rgb24, rgb24To8, rgb8, setColorEnabled, strikethrough, stripAnsiCode, underline, white, yellow };