import { DasherizeOptions } from "@neostd/slices/dasherize";

//#region src/dasherize.d.ts
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
declare function dasherize(value: string, options?: DasherizeOptions): string;
//#endregion
export { dasherize };
