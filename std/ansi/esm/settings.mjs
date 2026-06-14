import { Lazy } from "./_lazy.mjs";
import { AnsiModes } from "./enums.mjs";
import { detectMode } from "./detector.mjs";
import { stderr, stdout } from "@neostd/process";
//#region src/settings.ts
/**
* Terminal ANSI settings.
*
* @module
*/
let settings = new Lazy(() => new AnsiSettings(detectMode()));
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
var AnsiSettings = class {
	#mode;
	#links;
	/**
	* Creates a new ANSI settings object.
	*
	* @param mode The ANSI color mode to use.
	*/
	constructor(mode) {
		this.#mode = mode;
		this.#links = this.#mode === AnsiModes.TwentyFourBit;
	}
	/** Returns the active shared ANSI settings instance. */
	static get current() {
		return settings.value;
	}
	/** Replaces the active shared ANSI settings instance. */
	static set current(value) {
		settings = new Lazy(() => value);
	}
	/** Returns `true` when colors are enabled and stdout looks like a terminal. */
	get stdout() {
		return this.#mode > 0 ? stdout.isTerm() : false;
	}
	/** Returns `true` when colors are enabled and stderr looks like a terminal. */
	get stderr() {
		return this.#mode > 0 ? stderr.isTerm() : false;
	}
	/** Returns the configured ANSI mode. */
	get mode() {
		return this.#mode;
	}
	/** Updates the configured ANSI mode. */
	set mode(value) {
		this.#mode = value;
	}
	/** Returns `true` when terminal hyperlink output is enabled. */
	get links() {
		return this.#links;
	}
	/** Enables or disables terminal hyperlink output. */
	set links(value) {
		this.#links = value;
	}
};
//#endregion
export { AnsiSettings };
