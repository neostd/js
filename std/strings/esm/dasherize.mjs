import { dasherize as dasherize$1 } from "@neostd/slices/dasherize";
//#region src/dasherize.ts
/**
 * Converts a string to dash-separated kebab case.
 * @param value The string to convert.
 * @param options Options for the conversion.
 * @returns The kebab-cased string.
 * @example
 * ```typescript
 * import { dasherize } from "@neostd/strings";
 *
 * dasherize("helloWorld"); // "hello-world"
 * dasherize("hello_world"); // "hello-world"
 * ```
 */
function dasherize(value, options) {
  const result = dasherize$1(value, options);
  return String.fromCodePoint(...result);
}
//#endregion
export { dasherize };
