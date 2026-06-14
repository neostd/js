/**
 * Detects terminal ANSI support.
 *
 * @module
 */

import { DARWIN, WINDOWS, globals, loadOsModule } from "./globals.ts";
import { get, has } from "@neostd/env";
import { AnsiModes, type AnsiMode } from "./enums.ts";

let RELEASE = "";
let args: string[] = [];

if (globals.Deno) {
  RELEASE = (globals.Deno as { osRelease(): string }).osRelease();
  args = (globals.Deno as { args: string[] }).args;
} else if (globals.process) {
  RELEASE = loadOsModule()?.release() || "";
  args = (globals.process as { argv: string[] }).argv.slice(2);
}

function detectCi(): AnsiMode | null {
  if (has("CI")) {
    if (has("GITHUB_ACTIONS") || has("GITEA_ACTIONS") || has("CIRCLECI")) {
      return AnsiModes.TwentyFourBit;
    }

    if (
      ["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE", "TF_BUILD", "AGENT_NAME"].some(
        (sign) => has(sign),
      ) ||
      get("CI_NAME") === "codeship"
    ) {
      return AnsiModes.FourBit;
    }

    return AnsiModes.FourBit;
  }

  const teamCityVersion = get("TEAMCITY_VERSION");
  if (teamCityVersion) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(teamCityVersion)
      ? AnsiModes.FourBit
      : AnsiModes.None;
  }

  return null;
}

/**
 * Detects the current terminal ANSI mode from CLI flags, runtime hints, and
 * environment variables.
 *
 * Detection checks explicit flags such as `--color` and `--no-color`, common CI
 * markers, terminal environment variables, and platform-specific fallbacks.
 *
 * @example Usage
 * ```ts
 * import { detectMode } from "@neostd/ansi";
 *
 * const mode = detectMode();
 * ```
 *
 * @returns The detected ANSI mode.
 */
export function detectMode(): AnsiMode {
  if (args.includes("--no-color") || args.includes("--nocolor")) {
    return AnsiModes.None;
  }

  if (globals.Deno && (globals.Deno as { noColor?: boolean }).noColor) {
    return AnsiModes.None;
  }

  const index = args.indexOf("--color");
  const next = index + 1;
  let color = "";
  if (next < args.length) {
    const c = args[next];
    if (!c.startsWith("-")) {
      color = c;
    }
  }

  if (color.length === 0) {
    color =
      get("FORCE_COLOR") || get("COLOR") || get("ANSI_COLORS") || get("BEARZ_ANSI_COLOR") || "";
  }

  if (color.length > 0) {
    return AnsiModes.toValue(color) as AnsiMode;
  }

  if (has("TF_BUILD") && has("AGENT_NAME")) {
    return AnsiModes.FourBit;
  }

  const ci = detectCi();
  if (ci !== null) {
    return ci;
  }

  if (get("COLORTERM") === "truecolor") {
    return AnsiModes.TwentyFourBit;
  }

  const term = get("TERM");
  if (term) {
    if (term === "dumb") {
      return AnsiModes.None;
    }

    const mode = AnsiModes.toValue(term) as AnsiMode;
    if (mode > -1) {
      return mode;
    }
  }

  if (DARWIN) {
    const termProgram = get("TERM_PROGRAM");
    if (termProgram !== undefined) {
      const version = Number.parseInt((get("TERM_PROGRAM_VERSION") || "").split(".")[0], 10);
      switch (termProgram) {
        case "iTerm.app":
          return version >= 3 ? AnsiModes.TwentyFourBit : AnsiModes.EightBit;
        case "Apple_Terminal":
          return AnsiModes.EightBit;
      }
    }
  }

  if (term) {
    if (/-256(color)?$/i.test(term)) {
      return AnsiModes.EightBit;
    }

    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(term)) {
      return AnsiModes.FourBit;
    }
  }

  if (has("COLORTERM")) {
    return AnsiModes.FourBit;
  }

  if (WINDOWS) {
    const conEmu = get("ConEmuANSI");
    if (conEmu && conEmu.length) {
      switch (conEmu) {
        case "ON":
        case "on":
        case "On":
        case "1":
          return AnsiModes.TwentyFourBit;
      }
    }

    const v = RELEASE.split(".");
    if (Number(v[0]) > 9 && Number(v[2]) >= 18262) {
      return AnsiModes.TwentyFourBit;
    }

    return AnsiModes.FourBit;
  }

  return AnsiModes.None;
}
