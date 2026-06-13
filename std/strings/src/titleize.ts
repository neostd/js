import { titleize as toTitle } from "@neostd/slices/titleize";

/**
 * Converts a string to title case.
 * @param s The string to convert.
 * @returns The title-cased string.
 * @example
 * ```typescript
 * import { titleize } from "@neostd/strings";
 *
 * titleize("hello_world"); // "Hello World"
 * titleize("the quick fox"); // "the Quick Fox"
 * ```
 */
export function titleize(s: string): string {
  const result = toTitle(s);
  return String.fromCodePoint(...result);
}
