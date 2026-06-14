// Modified from Deno std/fmt color helpers.

/**
 * String formatters and utilities for ANSI color codes.
 *
 * @module
 */
import { AnsiSettings } from "./settings.ts";

interface Code {
  open: string;
  close: string;
  regexp: RegExp;
}

/** RGB color components used by the 24-bit color helpers. */
export interface Rgb {
  r: number;
  g: number;
  b: number;
}

let enabled = AnsiSettings.current.mode !== 0;

/**
 * Enables or disables ANSI styling globally for this module.
 *
 * @param value `true` to enable color output, `false` to disable it.
 */
export function setColorEnabled(value: boolean) {
  enabled = value;
}

/**
 * Returns whether ANSI styling is currently enabled.
 *
 * @returns `true` when ANSI styling is enabled.
 */
export function isColorEnabled(): boolean {
  return enabled;
}

function code(open: number[], close: number): Code {
  return {
    open: `\x1b[${open.join(";")}m`,
    close: `\x1b[${close}m`,
    regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
  };
}

function run(str: string, code: Code): string {
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
export function apply(str: string, ...styles: ((str: string) => string)[]): string {
  if (!isColorEnabled()) {
    return str;
  }

  return styles.reduce((str, fn) => fn(str), str);
}

/** Resets all ANSI styling for the provided string. */
export function reset(str: string): string {
  return run(str, code([0], 0));
}
/** Applies bold ANSI styling. */
export function bold(str: string): string {
  return run(str, code([1], 22));
}
/** Applies dim ANSI styling. */
export function dim(str: string): string {
  return run(str, code([2], 22));
}
/** Applies italic ANSI styling. */
export function italic(str: string): string {
  return run(str, code([3], 23));
}
/** Applies underline ANSI styling. */
export function underline(str: string): string {
  return run(str, code([4], 24));
}
/** Applies inverse ANSI styling. */
export function inverse(str: string): string {
  return run(str, code([7], 27));
}
/** Hides the string using ANSI hidden styling. */
export function hidden(str: string): string {
  return run(str, code([8], 28));
}
/** Applies strikethrough ANSI styling. */
export function strikethrough(str: string): string {
  return run(str, code([9], 29));
}
/** Applies the black foreground color. */
export function black(str: string): string {
  return run(str, code([30], 39));
}
/** Applies the red foreground color. */
export function red(str: string): string {
  return run(str, code([31], 39));
}
/** Applies the green foreground color. */
export function green(str: string): string {
  return run(str, code([32], 39));
}
/** Applies the yellow foreground color. */
export function yellow(str: string): string {
  return run(str, code([33], 39));
}
/** Applies the blue foreground color. */
export function blue(str: string): string {
  return run(str, code([34], 39));
}
/** Applies the magenta foreground color. */
export function magenta(str: string): string {
  return run(str, code([35], 39));
}
/** Applies the cyan foreground color. */
export function cyan(str: string): string {
  return run(str, code([36], 39));
}
/** Applies the white foreground color. */
export function white(str: string): string {
  return run(str, code([37], 39));
}
/** Alias of `brightBlack()`. */
export function gray(str: string): string {
  return brightBlack(str);
}
/** Applies the bright black foreground color. */
export function brightBlack(str: string): string {
  return run(str, code([90], 39));
}
/** Applies the bright red foreground color. */
export function brightRed(str: string): string {
  return run(str, code([91], 39));
}
/** Applies the bright green foreground color. */
export function brightGreen(str: string): string {
  return run(str, code([92], 39));
}
/** Applies the bright yellow foreground color. */
export function brightYellow(str: string): string {
  return run(str, code([93], 39));
}
/** Applies the bright blue foreground color. */
export function brightBlue(str: string): string {
  return run(str, code([94], 39));
}
/** Applies the bright magenta foreground color. */
export function brightMagenta(str: string): string {
  return run(str, code([95], 39));
}
/** Applies the bright cyan foreground color. */
export function brightCyan(str: string): string {
  return run(str, code([96], 39));
}
/** Applies the bright white foreground color. */
export function brightWhite(str: string): string {
  return run(str, code([97], 39));
}
/** Applies the black background color. */
export function bgBlack(str: string): string {
  return run(str, code([40], 49));
}
/** Applies the red background color. */
export function bgRed(str: string): string {
  return run(str, code([41], 49));
}
/** Applies the green background color. */
export function bgGreen(str: string): string {
  return run(str, code([42], 49));
}
/** Applies the yellow background color. */
export function bgYellow(str: string): string {
  return run(str, code([43], 49));
}
/** Applies the blue background color. */
export function bgBlue(str: string): string {
  return run(str, code([44], 49));
}
/** Applies the magenta background color. */
export function bgMagenta(str: string): string {
  return run(str, code([45], 49));
}
/** Applies the cyan background color. */
export function bgCyan(str: string): string {
  return run(str, code([46], 49));
}
/** Applies the white background color. */
export function bgWhite(str: string): string {
  return run(str, code([47], 49));
}
/** Applies the bright black background color. */
export function bgBrightBlack(str: string): string {
  return run(str, code([100], 49));
}
/** Applies the bright red background color. */
export function bgBrightRed(str: string): string {
  return run(str, code([101], 49));
}
/** Applies the bright green background color. */
export function bgBrightGreen(str: string): string {
  return run(str, code([102], 49));
}
/** Applies the bright yellow background color. */
export function bgBrightYellow(str: string): string {
  return run(str, code([103], 49));
}
/** Applies the bright blue background color. */
export function bgBrightBlue(str: string): string {
  return run(str, code([104], 49));
}
/** Applies the bright magenta background color. */
export function bgBrightMagenta(str: string): string {
  return run(str, code([105], 49));
}
/** Applies the bright cyan background color. */
export function bgBrightCyan(str: string): string {
  return run(str, code([106], 49));
}
/** Applies the bright white background color. */
export function bgBrightWhite(str: string): string {
  return run(str, code([107], 49));
}

function clampAndTruncate(n: number, max = 255, min = 0): number {
  return Math.trunc(Math.max(Math.min(n, max), min));
}

/**
 * Applies an 8-bit ANSI foreground color.
 *
 * @param str The string to style.
 * @param color The 8-bit ANSI palette value.
 * @returns The styled string.
 */
export function rgb8(str: string, color: number): string {
  return run(str, code([38, 5, clampAndTruncate(color)], 39));
}

/**
 * Converts a 24-bit color to the nearest 8-bit ANSI foreground color and
 * applies it.
 *
 * @param str The string to style.
 * @param color The 24-bit color number or RGB object.
 * @returns The styled string.
 */
export function rgb24To8(str: string, color: number | Rgb): string {
  if (typeof color === "number") {
    if (color < 256) {
      return rgb8(str, color);
    }

    color = { r: (color >> 16) & 0xff, g: (color >> 8) & 0xff, b: color & 0xff };
  }

  let { r, g, b } = color;
  r = Math.max(0, Math.min(r, 255));
  g = Math.max(0, Math.min(g, 255));
  b = Math.max(0, Math.min(b, 255));

  const rIndex = Math.round((r / 255) * 5);
  const gIndex = Math.round((g / 255) * 5);
  const bIndex = Math.round((b / 255) * 5);
  const ansiCode = 16 + 36 * rIndex + 6 * gIndex + bIndex;

  return rgb8(str, ansiCode);
}

/**
 * Applies an 8-bit ANSI background color.
 *
 * @param str The string to style.
 * @param color The 8-bit ANSI palette value.
 * @returns The styled string.
 */
export function bgRgb8(str: string, color: number): string {
  return run(str, code([48, 5, clampAndTruncate(color)], 49));
}

/**
 * Applies a 24-bit ANSI foreground color.
 *
 * @param str The string to style.
 * @param color The 24-bit color number or RGB object.
 * @returns The styled string.
 */
export function rgb24(str: string, color: number | Rgb): string {
  if (typeof color === "number") {
    return run(str, code([38, 2, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff], 39));
  }

  return run(
    str,
    code(
      [38, 2, clampAndTruncate(color.r), clampAndTruncate(color.g), clampAndTruncate(color.b)],
      39,
    ),
  );
}

/**
 * Applies a 24-bit ANSI background color.
 *
 * @param str The string to style.
 * @param color The 24-bit color number or RGB object.
 * @returns The styled string.
 */
export function bgRgb24(str: string, color: number | Rgb): string {
  if (typeof color === "number") {
    return run(str, code([48, 2, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff], 49));
  }

  return run(
    str,
    code(
      [48, 2, clampAndTruncate(color.r), clampAndTruncate(color.g), clampAndTruncate(color.b)],
      49,
    ),
  );
}

const ANSI_PATTERN = new RegExp(
  [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TXZcf-nq-uy=><~]))",
  ].join("|"),
  "g",
);

/**
 * Removes ANSI escape sequences from a string.
 *
 * @param string The string that may contain ANSI escape sequences.
 * @returns The string with ANSI escape sequences removed.
 */
export function stripAnsiCode(string: string): string {
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
export function defineColor(
  trueColor: number | Rgb,
  color256: number,
  color: (str: string) => string,
): (str: string) => string {
  return function (str: string): string {
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
export function defineBgColor(
  trueColor: number | Rgb,
  color256: number,
  color: (str: string) => string,
): (str: string) => string {
  return function (str: string): string {
    if (isColorEnabled()) {
      if (AnsiSettings.current.mode === 24) return bgRgb24(str, trueColor);
      if (AnsiSettings.current.mode === 8) return bgRgb8(str, color256);
      if (AnsiSettings.current.mode === 4) return color(str);
    }

    return str;
  };
}
