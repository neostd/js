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
export type AnsiMode = -1 | 0 | 3 | 4 | 8 | 24;

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
export const AnsiModes = {
  Auto: -1 as AnsiMode,
  None: 0 as AnsiMode,
  ThreeBit: 3 as AnsiMode,
  FourBit: 4 as AnsiMode,
  EightBit: 8 as AnsiMode,
  TwentyFourBit: 24 as AnsiMode,
  equals(a: AnsiMode, b: number | string): boolean {
    if (typeof b === "string") return a === (this.toValue(b) as AnsiMode);
    return a === b;
  },
  names(): string[] {
    return ["auto", "none", "3bit", "xterm-16color", "xterm-256color", "truecolor"];
  },
  values(): number[] {
    return [-1, 0, 3, 4, 8, 24];
  },
  toValue(name: string): number {
    switch (name) {
      case "auto":
      case "Auto":
        return -1;
      case "0":
      case "no":
      case "false":
      case "False":
      case "off":
      case "Off":
      case "none":
      case "None":
      case "NONE":
      case "no-color":
      case "No-Color":
      case "nocolor":
      case "Nocolor":
      case "noColor":
        return 0;
      case "3":
      case "3bit":
      case "3Bit":
      case "ThreeBit":
      case "threebit":
      case "Threebit":
        return 3;
      case "4":
      case "xterm-16color":
      case "Xterm-16Color":
      case "16color":
      case "16Color":
      case "vt100":
      case "vt100-color":
      case "vt200":
      case "vt200-color":
      case "screen":
      case "linux":
      case "cygwin":
      case "ansi":
      case "4bit":
      case "4Bit":
      case "FourBit":
      case "4colors":
      case "fourbit":
      case "Fourbit":
        return 4;
      case "8":
      case "8bit":
      case "8Bit":
      case "EightBit":
      case "256":
      case "256color":
      case "256Color":
      case "screen-256color":
      case "Screen-256Color":
      case "xterm-256color":
      case "Xterm-256Color":
        return 8;
      case "true":
      case "full":
      case "24":
      case "24bit":
      case "24Bit":
      case "TwentyFourBit":
      case "truecolor":
      case "TrueColor":
      case "true-color":
      case "True-Color":
      case "xterm-truecolor":
      case "Xterm-TrueColor":
      case "gnome-terminal":
      case "kitty":
      case "iTerm2":
      case "alacritty":
      case "wezterm":
      case "terminator":
      case "hyper":
      case "windows-terminal":
      case "ms-terminal":
      case "ghostty":
      case "xterm-ghostty":
      case "xterm-kitty":
      case "alacritty-nightly":
      case "terminology":
      case "mintty":
      case "terminus":
        return 24;
    }

    return -1;
  },
  toString(value: number): string {
    switch (value) {
      case -1:
        return "auto";
      case 0:
        return "none";
      case 3:
        return "3bit";
      case 4:
        return "xterm-16color";
      case 8:
        return "xterm-256color";
      case 24:
        return "truecolor";
    }

    return "auto";
  },
};

/**
 * Compares an ANSI mode against another mode, number, or string alias.
 *
 * @param a The left-hand ANSI mode.
 * @param b The right-hand mode value or alias.
 * @returns `true` when both values resolve to the same mode.
 */
export function equals(a: AnsiMode, b: number | string): boolean {
  return AnsiModes.equals(a, b);
}

/**
 * Syslog-style ANSI log levels.
 */
export type AnsiLogLevel = number;

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
export const AnsiLogLevels = {
  None: 0 as AnsiLogLevel,
  Critical: 2 as AnsiLogLevel,
  Error: 3 as AnsiLogLevel,
  Warning: 4 as AnsiLogLevel,
  Notice: 5 as AnsiLogLevel,
  Information: 6 as AnsiLogLevel,
  Debug: 7 as AnsiLogLevel,
  Trace: 8 as AnsiLogLevel,
  names(): string[] {
    return ["none", "critical", "error", "warning", "notice", "information", "debug", "trace"];
  },
  values(): number[] {
    return [0, 2, 3, 4, 5, 6, 7, 8];
  },
  toValue(name: string): number {
    switch (name) {
      case "none":
      case "None":
        return 0;
      case "critical":
      case "Critical":
      case "fatal":
      case "Fatal":
        return 2;
      case "error":
      case "Error":
        return 3;
      case "warn":
      case "Warn":
      case "warning":
      case "Warning":
        return 4;
      case "notice":
      case "Notice":
        return 5;
      case "info":
      case "Info":
      case "information":
      case "Information":
        return 6;
      case "debug":
      case "Debug":
        return 7;
      case "trace":
      case "Trace":
        return 8;
    }

    return 4;
  },
  toString(value: number): string {
    switch (value) {
      case 0:
        return "none";
      case 2:
        return "critical";
      case 3:
        return "error";
      case 4:
        return "warning";
      case 5:
        return "notice";
      case 6:
        return "information";
      case 7:
        return "debug";
      case 8:
        return "trace";
    }

    return "";
  },
};
