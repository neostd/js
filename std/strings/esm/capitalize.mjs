import { capitalize as capitalize$1 } from "@neostd/slices/capitalize";
//#region src/capitalize.ts
/**
 * Capitalizes the first character and lowercases the remaining characters.
 * @param value The string to capitalize.
 * @param options Options for capitalizing the string.
 * @returns The capitalized string.
 * @example
 * ```typescript
 * import { capitalize } from "@neostd/strings";
 *
 * capitalize("hello"); // "Hello"
 * capitalize("HELLO WORLD"); // "Hello world"
 * ```
 */
function capitalize(value, options) {
  const result = capitalize$1(value, options);
  return String.fromCodePoint(...result);
}
//#endregion
export { capitalize };
