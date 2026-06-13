import { underscore as underscore$1 } from "@neostd/slices/underscore";
//#region src/underscore.ts
/**
 * Converts a string to underscore-separated snake case.
 * @param value The string to convert.
 * @param options Options for the conversion.
 * @returns The snake-cased string.
 * @example
 * ```typescript
 * import { underscore } from "@neostd/strings";
 *
 * underscore("helloWorld"); // "hello_world"
 * underscore("helloWorld", { screaming: true }); // "HELLO_WORLD"
 * ```
 */
function underscore(value, options) {
  const result = underscore$1(value, options);
  return String.fromCodePoint(...result);
}
//#endregion
export { underscore };
