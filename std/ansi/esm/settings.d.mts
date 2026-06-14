import { AnsiMode } from "./enums.mjs";

//#region src/settings.d.ts
/**
 * Mutable ANSI runtime settings used by the style helpers.
 *
 * @example Usage
 * ```ts
 * import { AnsiModes, AnsiSettings } from "@neostd/ansi";
 *
 * AnsiSettings.current = new AnsiSettings(AnsiModes.TwentyFourBit);
 * ```
 */
declare class AnsiSettings {
  #private;
  /**
   * Creates a new ANSI settings object.
   *
   * @param mode The ANSI color mode to use.
   */
  constructor(mode: AnsiMode);
  /** Returns the active shared ANSI settings instance. */
  static get current(): AnsiSettings;
  /** Replaces the active shared ANSI settings instance. */
  static set current(value: AnsiSettings);
  /** Returns `true` when colors are enabled and stdout looks like a terminal. */
  get stdout(): boolean;
  /** Returns `true` when colors are enabled and stderr looks like a terminal. */
  get stderr(): boolean;
  /** Returns the configured ANSI mode. */
  get mode(): AnsiMode;
  /** Updates the configured ANSI mode. */
  set mode(value: AnsiMode);
  /** Returns `true` when terminal hyperlink output is enabled. */
  get links(): boolean;
  /** Enables or disables terminal hyperlink output. */
  set links(value: boolean);
}
//#endregion
export { AnsiSettings };