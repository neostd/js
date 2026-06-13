import { CapitalizeOptions } from "@neostd/slices/capitalize";

//#region src/capitalize.d.ts
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
declare function capitalize(value: string, options?: CapitalizeOptions): string;
//#endregion
export { capitalize };
