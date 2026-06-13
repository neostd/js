import { CharArrayBuilder } from "@neostd/slices/char-array-builder";

/**
 * Builds strings by appending text and character buffers before converting once.
 * @example
 * ```typescript
 * import { StringBuilder } from "@neostd/strings";
 *
 * const builder = new StringBuilder();
 * builder.append("Hello").append(" ").append("World");
 * builder.toString(); // "Hello World"
 * ```
 */
export class StringBuilder extends CharArrayBuilder {}
