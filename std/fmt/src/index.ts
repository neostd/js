/**
 * A cross-runtime string formatting module providing printf-style formatting,
 * value inspection, and ANSI code handling.
 *
 * @example
 * ```ts
 * import { echo, inspect, printf, sprintf } from "@neostd/fmt";
 *
 * const msg = sprintf("Hello %s! You have %d messages.", "Alice", 5);
 * printf("Processing: %d%%\n", 75);
 * echo("Hello, World!");
 * console.log(inspect({ user: "bob", scores: [95, 87, 92] }));
 * ```
 *
 * @module
 */
export * from "./printf.ts";
export * from "./inspect.ts";
