import { titleize as titleize$1 } from "@neostd/slices/titleize";
//#region src/titleize.ts
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
function titleize(s) {
  const result = titleize$1(s);
  return String.fromCodePoint(...result);
}
//#endregion
export { titleize };
