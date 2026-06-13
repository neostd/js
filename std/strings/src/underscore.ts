import { underscore as toUnderscore, type UnderScoreOptions } from "@neostd/slices/underscore";

/**
 * Converts a string to underscore-separated snake case.
 * @param value The string to convert.
 * @param options Options for the conversion.
 * @returns The snake-cased string.
 * @example
 * ```typescript
 * import { underscore } from "@neostd/strings";
 *
 * underscore("helloWorld"); // "hello_world"
 * underscore("helloWorld", { screaming: true }); // "HELLO_WORLD"
 * ```
 */
export function underscore(value: string, options?: UnderScoreOptions): string {
  const result = toUnderscore(value, options);
  return String.fromCodePoint(...result);
}
