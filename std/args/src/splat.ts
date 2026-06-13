import { split } from "./split.ts";

function dasherize(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

/** Options for {@linkcode splat}. */
export interface SplatOptions extends Record<string, unknown> {
  /** Command prefix to emit before options, as a string to split or a pre-tokenized array. */
  command?: string[] | string;
  /** Prefix for long options. Defaults to `"--"`. */
  prefix?: string;
  /** Option names that should emit explicit true/false values, or `true` for every boolean. */
  noargs?: string[] | boolean;
  /** Values used for `noargs` booleans. Defaults to `{ t: "true", f: "false" }`. */
  noFlagValues?: { t?: string; f?: string };
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
export interface SplatObject extends Record<string | symbol | number, unknown> {
  /** Inline options merged with the second `splat` parameter. */
  splat?: SplatOptions;
}

/**
 * Special symbols supported in a splat object.
 *
 * Symbols allow command, positional, remaining, and extra arguments to be specified without conflicting with option
 * names in the object being converted.
 */
export const SplatSymbols: Record<string, symbol> = {
  command: Symbol("@@command"),
  args: Symbol("@@args"),
  argNames: Symbol("@@arg-names"),
  extraArgs: Symbol("--"),
  remainingArgs: Symbol("_"),
};

function match(array: unknown[], value: string): boolean {
  return array.some((element) =>
    element instanceof RegExp ? element.test(value) : element === value,
  );
}

function stringify(value: unknown): string {
  if (
    typeof value === "bigint" ||
    typeof value === "boolean" ||
    typeof value === "number" ||
    typeof value === "string"
  ) {
    return String(value);
  }

  const json = JSON.stringify(value);
  return json ?? String(value);
}

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
export function splat(object: SplatObject, options?: SplatOptions): string[] {
  const optionValues: string[] = [];
  const splatted: string[] = [];
  let remainingArgs: unknown[] = [];
  let extraArgs: unknown[] = [];

  if (object.splat) {
    options = { ...object.splat, ...options };
    delete object.splat;
  }

  options = { shortFlag: true, prefix: "--", ...options };

  let commands: string[] = [];
  let argumentNames: string[] = options.argumentNames ?? [];

  if (options.command) {
    commands = typeof options.command === "string" ? split(options.command) : options.command;
  }

  if (Array.isArray(object[SplatSymbols.argNames])) {
    argumentNames = object[SplatSymbols.argNames] as string[];
  }

  const commandValue = object[SplatSymbols.command];
  if (typeof commandValue === "string") {
    commands = split(commandValue);
  } else if (Array.isArray(commandValue)) {
    commands = commandValue as string[];
  }

  if (Array.isArray(object[SplatSymbols.remainingArgs])) {
    remainingArgs = object[SplatSymbols.remainingArgs] as unknown[];
  }

  if (Array.isArray(object[SplatSymbols.extraArgs])) {
    extraArgs = object[SplatSymbols.extraArgs] as unknown[];
  }

  const makeArguments = (key: string, value?: unknown) => {
    const prefix = options?.shortFlag && key.length === 1 ? "-" : options?.prefix;
    const normalizedKey = options?.preserveCase ? key : dasherize(key);
    const option = `${prefix}${normalizedKey}`;

    if (options?.assign) {
      optionValues.push(option + (value ? `${options.assign}${stringify(value)}` : ""));
    } else {
      optionValues.push(option);
      if (value) {
        optionValues.push(stringify(value));
      }
    }
  };

  const makeAliasArg = (key: string, value?: unknown) => {
    const option = key.startsWith("-") || key.startsWith("/") ? key : `-${key}`;
    if (options?.assign) {
      optionValues.push(`${option}${options.assign}${stringify(value)}`);
    } else {
      optionValues.push(option);
      if (value) {
        optionValues.push(stringify(value));
      }
    }
  };

  let isNoFlag = (_key: string): boolean => false;
  if (options.noargs !== undefined) {
    options.noFlagValues ??= { t: "true", f: "false" };
    const noargs = options.noargs;
    isNoFlag = Array.isArray(noargs) ? (key) => noargs.includes(key) : () => true;
  }

  let positionalArgs: unknown[] = [];
  if (Array.isArray(object[SplatSymbols.args])) {
    positionalArgs = object[SplatSymbols.args] as unknown[];
  } else if (argumentNames.length > 0) {
    positionalArgs.length = argumentNames.length;
  }

  for (let [key, value] of Object.entries(object)) {
    let pushArguments = makeArguments;

    if (key === "*" || key === "_") {
      if (Array.isArray(value)) {
        positionalArgs.push(...value);
      } else if (typeof value === "string") {
        positionalArgs.push(value);
      }
      continue;
    }

    if (argumentNames.includes(key)) {
      let index = argumentNames.indexOf(key);
      if (value) {
        if (Array.isArray(value)) {
          for (const item of value) {
            positionalArgs[index++] = stringify(item);
          }
        } else {
          positionalArgs[index] = stringify(value);
        }
      }
      continue;
    }

    if (Array.isArray(options.excludes) && match(options.excludes, key)) {
      continue;
    }

    if (Array.isArray(options.includes) && !match(options.includes, key)) {
      continue;
    }

    if (typeof options.aliases === "object" && options.aliases[key]) {
      key = options.aliases[key];
      pushArguments = makeAliasArg;
    }

    if (key === "--") {
      if (!Array.isArray(value)) {
        throw new TypeError(`Expected key \`--\` to be Array, got ${typeof value}`);
      }
      extraArgs = value;
      continue;
    }

    if (key === "_") {
      if (typeof value === "string") {
        remainingArgs = [value];
        continue;
      }

      if (!Array.isArray(value)) {
        throw new TypeError(`Expected key \`_\` to be Array, got ${typeof value}`);
      }
      remainingArgs = value;
      continue;
    }

    if (value === true && !options.ignoreTrue) {
      pushArguments(key, isNoFlag(key) ? options.noFlagValues?.t : undefined);
    } else if (value === false && !options.ignoreFalse) {
      pushArguments(
        isNoFlag(key) ? key : `no-${key}`,
        isNoFlag(key) ? options.noFlagValues?.f : undefined,
      );
    } else if (
      typeof value === "string" ||
      (typeof value === "number" && !Number.isNaN(value)) ||
      typeof value === "bigint"
    ) {
      pushArguments(key, String(value));
    } else if (Array.isArray(value)) {
      for (const item of value) {
        pushArguments(key, item);
      }
    }
  }

  if (commands.length > 0) {
    splatted.push(...commands);
  }

  const normalizedArgs = positionalArgs.flatMap((arg) =>
    Array.isArray(arg) ? arg.map(stringify) : arg ? [stringify(arg)] : [],
  );

  if (!options.appendArguments) {
    splatted.push(...normalizedArgs);
  }

  splatted.push(...optionValues);

  if (options.appendArguments) {
    splatted.push(...normalizedArgs);
  }

  splatted.push(...remainingArgs.map(stringify));

  if (extraArgs.length > 0) {
    splatted.push("--", ...extraArgs.map(stringify));
  }

  return splatted;
}
