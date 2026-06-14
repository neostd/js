//#region src/enums.d.ts
/**
 * ANSI color mode and log level helpers.
 *
 * @module
 */
/**
 * ANSI color support levels.
 *
 * `-1` means auto-detect, while `0`, `4`, `8`, and `24` represent concrete
 * terminal color capabilities.
 */
type AnsiMode = -1 | 0 | 3 | 4 | 8 | 24;
/**
 * Named ANSI mode constants and conversion helpers.
 *
 * @example Usage
 * ```ts
 * import { AnsiModes } from "@neostd/ansi";
 *
 * AnsiModes.toValue("truecolor"); // 24
 * AnsiModes.toString(8); // "xterm-256color"
 * ```
 */
declare const AnsiModes: {
  Auto: AnsiMode;
  None: AnsiMode;
  ThreeBit: AnsiMode;
  FourBit: AnsiMode;
  EightBit: AnsiMode;
  TwentyFourBit: AnsiMode;
  equals(a: AnsiMode, b: number | string): boolean;
  names(): string[];
  values(): number[];
  toValue(name: string): number;
  toString(value: number): string;
};
/**
 * Compares an ANSI mode against another mode, number, or string alias.
 *
 * @param a The left-hand ANSI mode.
 * @param b The right-hand mode value or alias.
 * @returns `true` when both values resolve to the same mode.
 */
declare function equals(a: AnsiMode, b: number | string): boolean;
/**
 * Syslog-style ANSI log levels.
 */
type AnsiLogLevel = number;
/**
 * Named ANSI log level constants and conversion helpers.
 *
 * @example Usage
 * ```ts
 * import { AnsiLogLevels } from "@neostd/ansi";
 *
 * AnsiLogLevels.toValue("warn"); // 4
 * AnsiLogLevels.toString(6); // "information"
 * ```
 */
declare const AnsiLogLevels: {
  None: AnsiLogLevel;
  Critical: AnsiLogLevel;
  Error: AnsiLogLevel;
  Warning: AnsiLogLevel;
  Notice: AnsiLogLevel;
  Information: AnsiLogLevel;
  Debug: AnsiLogLevel;
  Trace: AnsiLogLevel;
  names(): string[];
  values(): number[];
  toValue(name: string): number;
  toString(value: number): string;
};
//#endregion
export { AnsiLogLevel, AnsiLogLevels, AnsiMode, AnsiModes, equals };