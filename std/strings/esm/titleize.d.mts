//#region src/titleize.d.ts
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
declare function titleize(s: string): string;
//#endregion
export { titleize };
