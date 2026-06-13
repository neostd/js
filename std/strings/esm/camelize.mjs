import { camelize as camelize$1 } from "@neostd/slices/camelize";
//#region src/camelize.ts
/**
 * Converts a string to camel case.
 * @param value The string to convert.
 * @param options Options for preserving case while joining words.
 * @returns The camel-cased string.
 * @example
 * ```typescript
 * import { camelize } from "@neostd/strings";
 *
 * camelize("hello_world"); // "helloWorld"
 * camelize("hello WORLD", { preserveCase: true }); // "helloWORLD"
 * ```
 */
function camelize(value, options) {
  const result = camelize$1(value, options);
  return String.fromCodePoint(...result);
}
//#endregion
export { camelize };
