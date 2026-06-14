/**
 * ANSI color detection, styles, and terminal settings.
 *
 * @example
 * ```ts
 * import { apply, bgBlue, blue, bold, green } from "@neostd/ansi";
 *
 * console.log(blue("test"));
 * console.log(green("success"));
 * console.log(bgBlue("background blue"));
 * console.log(apply("This is a test", bold, blue, bgBlue));
 * ```
 *
 * @module
 */
export * from "./styles.ts";
export * from "./enums.ts";
export * from "./settings.ts";
export * from "./detector.ts";
