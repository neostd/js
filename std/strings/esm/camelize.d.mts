import { CamelizeOptions } from "@neostd/slices/camelize";

//#region src/camelize.d.ts
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
declare function camelize(value: string, options?: CamelizeOptions): string;
//#endregion
export { camelize };
