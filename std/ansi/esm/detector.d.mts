import { AnsiMode } from "./enums.mjs";

//#region src/detector.d.ts
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
declare function detectMode(): AnsiMode;
//#endregion
export { detectMode };