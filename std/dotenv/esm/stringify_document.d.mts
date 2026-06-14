import { DotEnvDocument } from "./document.mjs";

//#region src/stringify_document.d.ts
/**
 * Options for stringifying a DotEnvDocument.
 */
interface StringifyDocumentOptions {
  /**
   * If `true`, uses only line feed (`\n`) as the newline character.
   * If `false`, uses the platform-specific end-of-line sequence.
   * @default false
   */
  onlyLineFeed?: boolean;
}
/**
 * Converts a DotEnvDocument into a dotenv-formatted string.
 *
 * This function preserves all tokens including comments, newlines, and key-value pairs,
 * allowing for round-trip parsing and stringifying of dotenv files.
 *
 * @param document - The DotEnvDocument to convert.
 * @param options - Optional settings to customize the stringification.
 * @returns A dotenv-formatted string representation of the document.
 *
 * @example Stringify a document with comments
 * ```ts
 * import { DotEnvDocument, stringifyDocument } from "@neostd/dotenv";
 *
 * const doc = new DotEnvDocument();
 * doc.comment("API Configuration");
 * doc.newline();
 * doc.item("API_KEY", "secret123");
 *
 * console.log(stringifyDocument(doc));
 * // #API Configuration
 * //
 * // API_KEY='secret123'
 * ```
 */
declare function stringifyDocument(
  document: DotEnvDocument,
  options?: StringifyDocumentOptions,
): string;
//#endregion
export { StringifyDocumentOptions, stringifyDocument };
