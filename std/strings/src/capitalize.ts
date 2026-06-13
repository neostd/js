import { capitalize as toCapitalized, type CapitalizeOptions } from "@neostd/slices/capitalize";

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
export function capitalize(value: string, options?: CapitalizeOptions): string {
  const result = toCapitalized(value, options);
  return String.fromCodePoint(...result);
}
