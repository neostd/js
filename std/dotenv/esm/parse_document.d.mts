import { DotEnvDocument } from "./document.mjs";

//#region src/parse_document.d.ts
/**
 * Parses the given content string as a dotenv document.
 *
 * This function processes the content line by line, handling comments,
 * key-value pairs, and quoted values. It supports different types of quotes
 * (single, double, and backtick) and allows for escaped characters within
 * quoted values.
 *
 * Escape sequences supported in double quotes and backticks:
 * - \n - newline
 * - \r - carriage return
 * - \t - tab
 * - \b - backspace
 * - \\ - backslash
 * - \" - double quote (in double-quoted strings)
 * - \' - single quote (in single-quoted strings)
 * - \` - backtick (in backtick-quoted strings)
 * - \uXXXX - 4-digit unicode escape
 * - \UXXXXXXXX - 8-digit unicode escape
 *
 * Single quotes only escape \' - all other backslash sequences are literal.
 *
 * Command substitution: $(...) in double-quoted strings preserves inner quotes.
 *
 * @param content - The content string to be parsed.
 * @returns A DotEnvDocument object representing the parsed content.
 * @throws Will throw an error if an invalid character is encountered in a key
 *         or if an empty key is found.
 */
declare function parseDocument(content: string): DotEnvDocument;
//#endregion
export { parseDocument };
