//#region src/printf.d.ts
declare function setNoColor(noColor: boolean): void;
/**
 * Converts and formats a variable number of `args` as is specified by `format`.
 * `sprintf` returns the formatted string.
 *
 * See the module documentation for the available format strings.
 *
 * @example Usage
 * ```ts
 * import { sprintf } from "@neostd/fmt";
 * import { equal } from "node:assert/strict";
 *
 * equal(sprintf("%d", 9), "9");
 *
 * equal(sprintf("%o", 9), "11");
 *
 * equal(sprintf("%f", 4), "4.000000");
 *
 * equal(sprintf("%.3f", 0.9999), "1.000");
 * ```
 *
 * @param format The format string to use
 * @param args The arguments to format
 * @returns The formatted string
 */
declare function sprintf(format: string, ...args: unknown[]): string;
/**
 * Converts and format a variable number of `args` as is specified by `format`.
 * `printf` writes the formatted string to standard output.
 *
 * See the module documentation for the available format strings.
 *
 * @example Usage
 * ```ts no-assert
 * import { printf } from "@neostd/fmt";
 *
 * printf("%d", 9); // Prints "9"
 *
 * printf("%o", 9); // Prints "11"
 *
 * printf("%f", 4); // Prints "4.000000"
 *
 * printf("%.3f", 0.9999); // Prints "1.000"
 * ```
 *
 * @param format The format string to use
 * @param args The arguments to format
 */
declare function printf(format: string, ...args: unknown[]): void;
/**
 * Converts and format a variable number of `args` as is specified by `format`.
 * `printf` writes the formatted string to standard output as a new line.
 *
 * See the module documentation for the available format strings.
 *
 * @example Usage
 * ```ts no-assert
 * import { printf } from "@neostd/fmt";
 *
 * printf("%d", 9); // Prints "9"
 *
 * printf("%o", 9); // Prints "11"
 *
 * printf("%f", 4); // Prints "4.000000"
 *
 * printf("%.3f", 0.9999); // Prints "1.000"
 * ```
 *
 * @param format The format string to use
 * @param args The arguments to format
 */
declare function echof(format: string, ...args: unknown[]): void;
/**
 * Print a newline to standard output.
 *
 * @param args The arguments to concatenate and print
 * @returns void
 * @example
 * ```ts
 * import { printLn } from "@neostd/fmt";
 *
 * printLn("Hello", "World"); // Prints "Hello World"
 * ```
 */
declare function print(...args: string[]): void;
/**
 * Print a newline to standard output.
 * @param args The arguments to concatenate and print
 *
 * @example
 * ```ts
 * import { printLn } from "@neostd/fmt";
 *
 * printLn("Hello", "World"); // Prints "Hello World\n"
 * ```
 */
declare function echo(...args: string[]): void;
/**
 * Format a string with a format string and arguments and return an
 * error with the formatted message.
 *
 * @param format The format string to use
 * @param args The arguments to format
 * @returns A new `Error` object with the formatted message.
 */
declare function errorf(format: string, ...args: unknown[]): Error;
//#endregion
export { echo, echof, errorf, print, printf, setNoColor, sprintf };
