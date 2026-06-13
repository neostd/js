//#region src/splat.d.ts
/** Options for {@linkcode splat}. */
interface SplatOptions extends Record<string, unknown> {
  /** Command prefix to emit before options, as a string to split or a pre-tokenized array. */
  command?: string[] | string;
  /** Prefix for long options. Defaults to `"--"`. */
  prefix?: string;
  /** Option names that should emit explicit true/false values, or `true` for every boolean. */
  noargs?: string[] | boolean;
  /** Values used for `noargs` booleans. Defaults to `{ t: "true", f: "false" }`. */
  noFlagValues?: {
    t?: string;
    f?: string;
  };
  /** Map object keys to explicit option names. */
  aliases?: Record<string, string>;
  /** Assignment token for option values, such as `"="` or `":"`. Defaults to separate arguments. */
  assign?: string;
  /** Preserve object key casing instead of dasherizing keys. */
  preserveCase?: boolean;
  /** Emit single-character keys with `-x` instead of `--x`. Defaults to `true`. */
  shortFlag?: boolean;
  /** Only include matching keys. Takes precedence after excludes. */
  includes?: Array<string | RegExp>;
  /** Exclude matching keys. */
  excludes?: Array<string | RegExp>;
  /** Do not emit options with value `true`. */
  ignoreTrue?: boolean;
  /** Do not emit options with value `false`. */
  ignoreFalse?: boolean;
  /** Object keys that should be emitted as positional arguments in the given order. */
  argumentNames?: string[];
  /** Emit positional arguments after options instead of before options. */
  appendArguments?: boolean;
}
/** Object accepted by {@linkcode splat}. */
interface SplatObject extends Record<string | symbol | number, unknown> {
  /** Inline options merged with the second `splat` parameter. */
  splat?: SplatOptions;
}
/**
 * Special symbols supported in a splat object.
 *
 * Symbols allow command, positional, remaining, and extra arguments to be specified without conflicting with option
 * names in the object being converted.
 */
declare const SplatSymbols: Record<string, symbol>;
/**
 * Converts an object to an array of command-line arguments.
 *
 * Boolean `true` values emit flags, boolean `false` values emit `--no-name`, strings/numbers/bigints emit option
 * values, and arrays repeat the option for each item. Positional arguments can be provided with `"*"`, `_`,
 * `argumentNames`, or {@linkcode SplatSymbols}.
 *
 * @param object Object to convert into command arguments.
 * @param options Conversion options. Inline `object.splat` options are also supported.
 * @returns Command argument array.
 *
 * @example
 * ```ts
 * splat({ all: true, output: "file.txt", "*": ["src"] });
 * // ["src", "--all", "--output", "file.txt"]
 * ```
 */
declare function splat(object: SplatObject, options?: SplatOptions): string[];
//#endregion
export { SplatObject, SplatOptions, SplatSymbols, splat };
