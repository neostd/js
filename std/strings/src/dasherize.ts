import { dasherize as toDashed, type DasherizeOptions } from "@neostd/slices/dasherize";

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
export function dasherize(value: string, options?: DasherizeOptions): string {
  const result = toDashed(value, options);
  return String.fromCodePoint(...result);
}
