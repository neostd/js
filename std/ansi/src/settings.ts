/**
 * Terminal ANSI settings.
 *
 * @module
 */
import { Lazy } from "./_lazy.ts";
import { detectMode } from "./detector.ts";
import { AnsiModes, type AnsiMode } from "./enums.ts";
import { stderr, stdout } from "@neostd/process";

let settings = new Lazy<AnsiSettings>(() => new AnsiSettings(detectMode()));

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
export class AnsiSettings {
  #mode: AnsiMode;
  #links: boolean;

  /**
   * Creates a new ANSI settings object.
   *
   * @param mode The ANSI color mode to use.
   */
  constructor(mode: AnsiMode) {
    this.#mode = mode;
    this.#links = this.#mode === AnsiModes.TwentyFourBit;
  }

  /** Returns the active shared ANSI settings instance. */
  static get current(): AnsiSettings {
    return settings.value;
  }

  /** Replaces the active shared ANSI settings instance. */
  static set current(value: AnsiSettings) {
    settings = new Lazy<AnsiSettings>(() => value);
  }

  /** Returns `true` when colors are enabled and stdout looks like a terminal. */
  get stdout(): boolean {
    return this.#mode > 0 ? stdout.isTerm() : false;
  }

  /** Returns `true` when colors are enabled and stderr looks like a terminal. */
  get stderr(): boolean {
    return this.#mode > 0 ? stderr.isTerm() : false;
  }

  /** Returns the configured ANSI mode. */
  get mode(): AnsiMode {
    return this.#mode;
  }

  /** Updates the configured ANSI mode. */
  set mode(value: AnsiMode) {
    this.#mode = value;
  }

  /** Returns `true` when terminal hyperlink output is enabled. */
  get links(): boolean {
    return this.#links;
  }

  /** Enables or disables terminal hyperlink output. */
  set links(value: boolean) {
    this.#links = value;
  }
}
