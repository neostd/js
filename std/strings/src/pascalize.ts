import { pascalize as toPascal } from "@neostd/slices/pascalize";

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
export function pascalize(value: string): string {
  const result = toPascal(value);
  return String.fromCodePoint(...result);
}
