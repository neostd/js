import { deepStrictEqual, notStrictEqual, strictEqual } from "node:assert/strict";
import { test } from "node:test";
import {
  AnsiLogLevels,
  AnsiModes,
  AnsiSettings,
  apply,
  bgBlue,
  bgRgb24,
  bgRgb8,
  blue,
  bold,
  defineBgColor,
  defineColor,
  detectMode,
  equals,
  gray,
  green,
  isColorEnabled,
  rgb24,
  rgb24To8,
  rgb8,
  setColorEnabled,
  stripAnsiCode,
} from "../src/index.ts";

test("ansi::mode helpers convert and compare names", () => {
  strictEqual(AnsiModes.toValue("truecolor"), AnsiModes.TwentyFourBit);
  strictEqual(AnsiModes.toValue("xterm-256color"), AnsiModes.EightBit);
  strictEqual(AnsiModes.toValue("nocolor"), AnsiModes.None);
  strictEqual(AnsiModes.toString(AnsiModes.FourBit), "xterm-16color");
  strictEqual(equals(AnsiModes.TwentyFourBit, "truecolor"), true);
  strictEqual(equals(AnsiModes.FourBit, AnsiModes.EightBit), false);
  deepStrictEqual(AnsiModes.names(), [
    "auto",
    "none",
    "3bit",
    "xterm-16color",
    "xterm-256color",
    "truecolor",
  ]);
  deepStrictEqual(AnsiModes.values(), [-1, 0, 3, 4, 8, 24]);
});

test("ansi::log level helpers convert names and values", () => {
  strictEqual(AnsiLogLevels.toValue("warn"), AnsiLogLevels.Warning);
  strictEqual(AnsiLogLevels.toValue("fatal"), AnsiLogLevels.Critical);
  strictEqual(AnsiLogLevels.toString(AnsiLogLevels.Information), "information");
  strictEqual(AnsiLogLevels.toValue("unknown"), AnsiLogLevels.Warning);
  deepStrictEqual(AnsiLogLevels.names(), [
    "none",
    "critical",
    "error",
    "warning",
    "notice",
    "information",
    "debug",
    "trace",
  ]);
  deepStrictEqual(AnsiLogLevels.values(), [0, 2, 3, 4, 5, 6, 7, 8]);
});

test("ansi::style helpers apply and strip escape codes", () => {
  const previous = isColorEnabled();
  setColorEnabled(true);

  try {
    const styled = apply("hello", bold, blue, bgBlue);

    strictEqual(stripAnsiCode(styled), "hello");
    strictEqual(styled.includes("\x1b[1m"), true);
    strictEqual(styled.includes("\x1b[34m"), true);
    strictEqual(styled.includes("\x1b[44m"), true);
    strictEqual(gray("x"), "\x1b[90mx\x1b[39m");
    strictEqual(green("ok"), "\x1b[32mok\x1b[39m");
  } finally {
    setColorEnabled(previous);
  }
});

test("ansi::style helpers return plain strings when disabled", () => {
  const previous = isColorEnabled();
  setColorEnabled(false);

  try {
    strictEqual(apply("hello", bold, blue), "hello");
    strictEqual(blue("hello"), "hello");
    strictEqual(rgb8("hello", 10), "hello");
  } finally {
    setColorEnabled(previous);
  }
});

test("ansi::rgb helpers clamp and convert colors", () => {
  const previous = isColorEnabled();
  setColorEnabled(true);

  try {
    strictEqual(rgb8("x", 999), "\x1b[38;5;255mx\x1b[39m");
    strictEqual(bgRgb8("x", -10), "\x1b[48;5;0mx\x1b[49m");
    strictEqual(rgb24("x", { r: 256, g: -1, b: 12.9 }), "\x1b[38;2;255;0;12mx\x1b[39m");
    strictEqual(bgRgb24("x", 0x123456), "\x1b[48;2;18;52;86mx\x1b[49m");
    strictEqual(rgb24To8("x", 0xff0000), "\x1b[38;5;196mx\x1b[39m");
  } finally {
    setColorEnabled(previous);
  }
});

test("ansi::defineColor helpers select output from mode", () => {
  const previousSettings = AnsiSettings.current;
  const previousEnabled = isColorEnabled();
  const custom = new AnsiSettings(AnsiModes.TwentyFourBit);
  const foreground = defineColor(0x123456, 33, blue);
  const background = defineBgColor(0x123456, 33, bgBlue);

  setColorEnabled(true);

  try {
    AnsiSettings.current = custom;

    custom.mode = AnsiModes.TwentyFourBit;
    strictEqual(foreground("x"), "\x1b[38;2;18;52;86mx\x1b[39m");
    strictEqual(background("x"), "\x1b[48;2;18;52;86mx\x1b[49m");

    custom.mode = AnsiModes.EightBit;
    strictEqual(foreground("x"), "\x1b[38;5;33mx\x1b[39m");

    custom.mode = AnsiModes.FourBit;
    strictEqual(foreground("x"), blue("x"));
  } finally {
    AnsiSettings.current = previousSettings;
    setColorEnabled(previousEnabled);
  }
});

test("ansi::settings current and links can be configured", () => {
  const previous = AnsiSettings.current;
  const next = new AnsiSettings(AnsiModes.EightBit);

  try {
    AnsiSettings.current = next;
    strictEqual(AnsiSettings.current, next);
    strictEqual(next.mode, AnsiModes.EightBit);
    strictEqual(next.links, false);

    next.mode = AnsiModes.FourBit;
    next.links = true;

    strictEqual(next.mode, AnsiModes.FourBit);
    strictEqual(next.links, true);
    notStrictEqual(typeof next.stdout, "undefined");
    notStrictEqual(typeof next.stderr, "undefined");
  } finally {
    AnsiSettings.current = previous;
  }
});

test("ansi::detectMode returns a known mode", () => {
  strictEqual(AnsiModes.values().includes(detectMode()), true);
});
