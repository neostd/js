import { t as CharArrayBuilder } from "./char-array-builder-DnTO5V-m.mjs";
import { toCharSliceLike } from "./utils.mjs";
import { CHAR_HYPHEN_MINUS, CHAR_UNDERSCORE } from "@neostd/chars/constants";
import { isDigit } from "@neostd/chars/is-digit";
import { isLetter } from "@neostd/chars/is-letter";
import { isSpace } from "@neostd/chars/is-space";
import { toLower } from "@neostd/chars/to-lower";
import { toUpper } from "@neostd/chars/to-upper";
//#region src/camelize.ts
/**
 * The `camelize` module provides a function to convert strings to camelCase.
 * Handles snake_case, kebab-case, and space-separated words.
 *
 * @example Basic usage
 * ```ts
 * import { camelize } from "@neostd/slices/camelize";
 *
 * String.fromCodePoint(...camelize("hello_world"));  // "helloWorld"
 * String.fromCodePoint(...camelize("hello-world"));  // "helloWorld"
 * String.fromCodePoint(...camelize("hello world"));  // "helloWorld"
 * ```
 *
 * @module
 */
/**
 * Converts a string to camelCase. Handles snake_case, kebab-case, and
 * space-separated words by removing separators and capitalizing the
 * following character.
 *
 * The first character is always lowercased. Characters after separators
 * (`_`, `-`, or space) are uppercased.
 *
 * @param value - The string to convert to camelCase.
 * @param options - Options to control case handling.
 * @returns The camelCase string as a Uint32Array.
 *
 * @example Basic conversions
 * ```ts
 * String.fromCodePoint(...camelize("hello_world"));  // "helloWorld"
 * String.fromCodePoint(...camelize("hello-world"));  // "helloWorld"
 * String.fromCodePoint(...camelize("hello world"));  // "helloWorld"
 * String.fromCodePoint(...camelize("HelloWorld"));   // "helloWorld"
 * ```
 *
 * @example Multiple separators
 * ```ts
 * String.fromCodePoint(...camelize("hello__world"));  // "helloWorld"
 * String.fromCodePoint(...camelize("hello--world"));  // "helloWorld"
 * ```
 *
 * @example With numbers
 * ```ts
 * String.fromCodePoint(...camelize("hello_world_123"));  // "helloWorld123"
 * String.fromCodePoint(...camelize("version_2_0"));  // "version20"
 * ```
 *
 * @example With Unicode
 * ```ts
 * String.fromCodePoint(...camelize("café_latte"));  // "caféLatte"
 * String.fromCodePoint(...camelize("über_mensch"));  // "überMensch"
 * ```
 */
function camelize(value, options) {
  options ??= {};
  const v = toCharSliceLike(value);
  const sb = new CharArrayBuilder();
  let last = 0;
  for (let i = 0; i < value.length; i++) {
    const c = v.at(i) ?? -1;
    if (c === -1) continue;
    if (i === 0 && isLetter(c)) {
      sb.appendChar(options.preserveCase ? c : toLower(c));
      last = c;
      continue;
    }
    if (isLetter(c)) {
      if (last === CHAR_UNDERSCORE) {
        sb.appendChar(options.preserveCase ? c : toUpper(c));
        last = c;
        continue;
      }
      sb.appendChar(c);
      last = c;
      continue;
    }
    if (c === CHAR_HYPHEN_MINUS || c === CHAR_UNDERSCORE || isSpace(c)) {
      last = CHAR_UNDERSCORE;
      continue;
    }
    if (isDigit(c)) {
      last = c;
      sb.appendChar(c);
      continue;
    }
    sb.appendChar(c);
    last = c;
  }
  const r = sb.toArray();
  sb.clear();
  return r;
}
//#endregion
export { camelize };
