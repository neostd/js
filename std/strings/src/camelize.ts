import { camelize as toCamel, type CamelizeOptions } from "@neostd/slices/camelize";

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
export function camelize(value: string, options?: CamelizeOptions): string {
  const result = toCamel(value, options);
  return String.fromCodePoint(...result);
}
