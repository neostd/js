import { pascalize as pascalize$1 } from "@neostd/slices/pascalize";
//#region src/pascalize.ts
/**
 * Converts a string to PascalCase.
 * @param value The string to convert.
 * @returns The Pascal-cased string.
 * @example
 * ```typescript
 * import { pascalize } from "@neostd/strings";
 *
 * pascalize("hello world"); // "HelloWorld"
 * pascalize("hello_world-test"); // "HelloWorldTest"
 * ```
 */
function pascalize(value) {
  const result = pascalize$1(value);
  return String.fromCodePoint(...result);
}
//#endregion
export { pascalize };
