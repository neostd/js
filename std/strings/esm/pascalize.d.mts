//#region src/pascalize.d.ts
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
declare function pascalize(value: string): string;
//#endregion
export { pascalize };
