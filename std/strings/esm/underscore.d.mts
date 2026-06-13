import { UnderScoreOptions } from "@neostd/slices/underscore";

//#region src/underscore.d.ts
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
declare function underscore(value: string, options?: UnderScoreOptions): string;
//#endregion
export { underscore };
