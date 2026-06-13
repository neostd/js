//#region src/inflect.d.ts
/**
 * Converts a singular English noun to its plural form.
 * @param str The word to pluralize.
 * @param plural Optional override returned instead of applying rules.
 * @returns The pluralized word.
 * @example
 * ```typescript
 * import { pluralize } from "@neostd/strings";
 *
 * pluralize("person"); // "people"
 * pluralize("person", "folks"); // "folks"
 * ```
 */
declare function pluralize(str: string, plural?: string): string;
/**
 * Converts a plural English noun to its singular form.
 * @param str The word to singularize.
 * @param singular Optional override returned instead of applying rules.
 * @returns The singularized word.
 * @example
 * ```typescript
 * import { singularize } from "@neostd/strings";
 *
 * singularize("people"); // "person"
 * singularize("people", "human"); // "human"
 * ```
 */
declare function singularize(str: string, singular?: string): string;
/**
 * Converts a word to singular or plural form based on a count.
 * @param str The word to inflect.
 * @param count The count used to choose singular (`1`) or plural (all other numbers).
 * @param singular Optional singular override.
 * @param plural Optional plural override.
 * @returns The inflected word.
 * @example
 * ```typescript
 * import { inflect } from "@neostd/strings";
 *
 * inflect("people", 1); // "person"
 * inflect("person", 2); // "people"
 * ```
 */
declare function inflect(str: string, count: number, singular?: string, plural?: string): string;
//#endregion
export { inflect, pluralize, singularize };
