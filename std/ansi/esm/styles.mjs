import { AnsiSettings } from "./settings.mjs";
//#region src/styles.ts
/**
* String formatters and utilities for ANSI color codes.
*
* @module
*/
let enabled = AnsiSettings.current.mode !== 0;
/**
* Enables or disables ANSI styling globally for this module.
*
* @param value `true` to enable color output, `false` to disable it.
*/
function setColorEnabled(value) {
	enabled = value;
}
/**
* Returns whether ANSI styling is currently enabled.
*
* @returns `true` when ANSI styling is enabled.
*/
function isColorEnabled() {
	return enabled;
}
function code(open, close) {
	return {
		open: `\x1b[${open.join(";")}m`,
		close: `\x1b[${close}m`,
		regexp: new RegExp(`\\x1b\\[${close}m`, "g")
	};
}
function run(str, code) {
	return isColorEnabled() ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}` : str;
}
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
function apply(str, ...styles) {
	if (!isColorEnabled()) return str;
	return styles.reduce((str, fn) => fn(str), str);
}
/** Resets all ANSI styling for the provided string. */
function reset(str) {
	return run(str, code([0], 0));
}
/** Applies bold ANSI styling. */
function bold(str) {
	return run(str, code([1], 22));
}
/** Applies dim ANSI styling. */
function dim(str) {
	return run(str, code([2], 22));
}
/** Applies italic ANSI styling. */
function italic(str) {
	return run(str, code([3], 23));
}
/** Applies underline ANSI styling. */
function underline(str) {
	return run(str, code([4], 24));
}
/** Applies inverse ANSI styling. */
function inverse(str) {
	return run(str, code([7], 27));
}
/** Hides the string using ANSI hidden styling. */
function hidden(str) {
	return run(str, code([8], 28));
}
/** Applies strikethrough ANSI styling. */
function strikethrough(str) {
	return run(str, code([9], 29));
}
/** Applies the black foreground color. */
function black(str) {
	return run(str, code([30], 39));
}
/** Applies the red foreground color. */
function red(str) {
	return run(str, code([31], 39));
}
/** Applies the green foreground color. */
function green(str) {
	return run(str, code([32], 39));
}
/** Applies the yellow foreground color. */
function yellow(str) {
	return run(str, code([33], 39));
}
/** Applies the blue foreground color. */
function blue(str) {
	return run(str, code([34], 39));
}
/** Applies the magenta foreground color. */
function magenta(str) {
	return run(str, code([35], 39));
}
/** Applies the cyan foreground color. */
function cyan(str) {
	return run(str, code([36], 39));
}
/** Applies the white foreground color. */
function white(str) {
	return run(str, code([37], 39));
}
/** Alias of `brightBlack()`. */
function gray(str) {
	return brightBlack(str);
}
/** Applies the bright black foreground color. */
function brightBlack(str) {
	return run(str, code([90], 39));
}
/** Applies the bright red foreground color. */
function brightRed(str) {
	return run(str, code([91], 39));
}
/** Applies the bright green foreground color. */
function brightGreen(str) {
	return run(str, code([92], 39));
}
/** Applies the bright yellow foreground color. */
function brightYellow(str) {
	return run(str, code([93], 39));
}
/** Applies the bright blue foreground color. */
function brightBlue(str) {
	return run(str, code([94], 39));
}
/** Applies the bright magenta foreground color. */
function brightMagenta(str) {
	return run(str, code([95], 39));
}
/** Applies the bright cyan foreground color. */
function brightCyan(str) {
	return run(str, code([96], 39));
}
/** Applies the bright white foreground color. */
function brightWhite(str) {
	return run(str, code([97], 39));
}
/** Applies the black background color. */
function bgBlack(str) {
	return run(str, code([40], 49));
}
/** Applies the red background color. */
function bgRed(str) {
	return run(str, code([41], 49));
}
/** Applies the green background color. */
function bgGreen(str) {
	return run(str, code([42], 49));
}
/** Applies the yellow background color. */
function bgYellow(str) {
	return run(str, code([43], 49));
}
/** Applies the blue background color. */
function bgBlue(str) {
	return run(str, code([44], 49));
}
/** Applies the magenta background color. */
function bgMagenta(str) {
	return run(str, code([45], 49));
}
/** Applies the cyan background color. */
function bgCyan(str) {
	return run(str, code([46], 49));
}
/** Applies the white background color. */
function bgWhite(str) {
	return run(str, code([47], 49));
}
/** Applies the bright black background color. */
function bgBrightBlack(str) {
	return run(str, code([100], 49));
}
/** Applies the bright red background color. */
function bgBrightRed(str) {
	return run(str, code([101], 49));
}
/** Applies the bright green background color. */
function bgBrightGreen(str) {
	return run(str, code([102], 49));
}
/** Applies the bright yellow background color. */
function bgBrightYellow(str) {
	return run(str, code([103], 49));
}
/** Applies the bright blue background color. */
function bgBrightBlue(str) {
	return run(str, code([104], 49));
}
/** Applies the bright magenta background color. */
function bgBrightMagenta(str) {
	return run(str, code([105], 49));
}
/** Applies the bright cyan background color. */
function bgBrightCyan(str) {
	return run(str, code([106], 49));
}
/** Applies the bright white background color. */
function bgBrightWhite(str) {
	return run(str, code([107], 49));
}
function clampAndTruncate(n, max = 255, min = 0) {
	return Math.trunc(Math.max(Math.min(n, max), min));
}
/**
* Applies an 8-bit ANSI foreground color.
*
* @param str The string to style.
* @param color The 8-bit ANSI palette value.
* @returns The styled string.
*/
function rgb8(str, color) {
	return run(str, code([
		38,
		5,
		clampAndTruncate(color)
	], 39));
}
/**
* Converts a 24-bit color to the nearest 8-bit ANSI foreground color and
* applies it.
*
* @param str The string to style.
* @param color The 24-bit color number or RGB object.
* @returns The styled string.
*/
function rgb24To8(str, color) {
	if (typeof color === "number") {
		if (color < 256) return rgb8(str, color);
		color = {
			r: color >> 16 & 255,
			g: color >> 8 & 255,
			b: color & 255
		};
	}
	let { r, g, b } = color;
	r = Math.max(0, Math.min(r, 255));
	g = Math.max(0, Math.min(g, 255));
	b = Math.max(0, Math.min(b, 255));
	const rIndex = Math.round(r / 255 * 5);
	const gIndex = Math.round(g / 255 * 5);
	const bIndex = Math.round(b / 255 * 5);
	return rgb8(str, 16 + 36 * rIndex + 6 * gIndex + bIndex);
}
/**
* Applies an 8-bit ANSI background color.
*
* @param str The string to style.
* @param color The 8-bit ANSI palette value.
* @returns The styled string.
*/
function bgRgb8(str, color) {
	return run(str, code([
		48,
		5,
		clampAndTruncate(color)
	], 49));
}
/**
* Applies a 24-bit ANSI foreground color.
*
* @param str The string to style.
* @param color The 24-bit color number or RGB object.
* @returns The styled string.
*/
function rgb24(str, color) {
	if (typeof color === "number") return run(str, code([
		38,
		2,
		color >> 16 & 255,
		color >> 8 & 255,
		color & 255
	], 39));
	return run(str, code([
		38,
		2,
		clampAndTruncate(color.r),
		clampAndTruncate(color.g),
		clampAndTruncate(color.b)
	], 39));
}
/**
* Applies a 24-bit ANSI background color.
*
* @param str The string to style.
* @param color The 24-bit color number or RGB object.
* @returns The styled string.
*/
function bgRgb24(str, color) {
	if (typeof color === "number") return run(str, code([
		48,
		2,
		color >> 16 & 255,
		color >> 8 & 255,
		color & 255
	], 49));
	return run(str, code([
		48,
		2,
		clampAndTruncate(color.r),
		clampAndTruncate(color.g),
		clampAndTruncate(color.b)
	], 49));
}
const ANSI_PATTERN = new RegExp(["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TXZcf-nq-uy=><~]))"].join("|"), "g");
/**
* Removes ANSI escape sequences from a string.
*
* @param string The string that may contain ANSI escape sequences.
* @returns The string with ANSI escape sequences removed.
*/
function stripAnsiCode(string) {
	return string.replace(ANSI_PATTERN, "");
}
/**
* Creates a foreground color helper that adapts to the active ANSI mode.
*
* @param trueColor The 24-bit color to use in truecolor terminals.
* @param color256 The 8-bit palette color to use in 256-color terminals.
* @param color The 4-bit fallback color helper.
* @returns A style function that applies the best available foreground color.
*/
function defineColor(trueColor, color256, color) {
	return function(str) {
		if (isColorEnabled()) {
			if (AnsiSettings.current.mode === 24) return rgb24(str, trueColor);
			if (AnsiSettings.current.mode === 8) return rgb8(str, color256);
			if (AnsiSettings.current.mode === 4) return color(str);
		}
		return str;
	};
}
/**
* Creates a background color helper that adapts to the active ANSI mode.
*
* @param trueColor The 24-bit color to use in truecolor terminals.
* @param color256 The 8-bit palette color to use in 256-color terminals.
* @param color The 4-bit fallback background color helper.
* @returns A style function that applies the best available background color.
*/
function defineBgColor(trueColor, color256, color) {
	return function(str) {
		if (isColorEnabled()) {
			if (AnsiSettings.current.mode === 24) return bgRgb24(str, trueColor);
			if (AnsiSettings.current.mode === 8) return bgRgb8(str, color256);
			if (AnsiSettings.current.mode === 4) return color(str);
		}
		return str;
	};
}
//#endregion
export { apply, bgBlack, bgBlue, bgBrightBlack, bgBrightBlue, bgBrightCyan, bgBrightGreen, bgBrightMagenta, bgBrightRed, bgBrightWhite, bgBrightYellow, bgCyan, bgGreen, bgMagenta, bgRed, bgRgb24, bgRgb8, bgWhite, bgYellow, black, blue, bold, brightBlack, brightBlue, brightCyan, brightGreen, brightMagenta, brightRed, brightWhite, brightYellow, cyan, defineBgColor, defineColor, dim, gray, green, hidden, inverse, isColorEnabled, italic, magenta, red, reset, rgb24, rgb24To8, rgb8, setColorEnabled, strikethrough, stripAnsiCode, underline, white, yellow };
