import { split } from "./split.mjs";
//#region src/splat.ts
function dasherize(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}
/**
 * Special symbols supported in a splat object.
 *
 * Symbols allow command, positional, remaining, and extra arguments to be specified without conflicting with option
 * names in the object being converted.
 */
const SplatSymbols = {
  command: Symbol("@@command"),
  args: Symbol("@@args"),
  argNames: Symbol("@@arg-names"),
  extraArgs: Symbol("--"),
  remainingArgs: Symbol("_"),
};
function match(array, value) {
  return array.some((element) =>
    element instanceof RegExp ? element.test(value) : element === value,
  );
}
function stringify(value) {
  if (
    typeof value === "bigint" ||
    typeof value === "boolean" ||
    typeof value === "number" ||
    typeof value === "string"
  )
    return String(value);
  return JSON.stringify(value) ?? String(value);
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
function splat(object, options) {
  const optionValues = [];
  const splatted = [];
  let remainingArgs = [];
  let extraArgs = [];
  if (object.splat) {
    options = {
      ...object.splat,
      ...options,
    };
    delete object.splat;
  }
  options = {
    shortFlag: true,
    prefix: "--",
    ...options,
  };
  let commands = [];
  let argumentNames = options.argumentNames ?? [];
  if (options.command)
    commands = typeof options.command === "string" ? split(options.command) : options.command;
  if (Array.isArray(object[SplatSymbols.argNames])) argumentNames = object[SplatSymbols.argNames];
  const commandValue = object[SplatSymbols.command];
  if (typeof commandValue === "string") commands = split(commandValue);
  else if (Array.isArray(commandValue)) commands = commandValue;
  if (Array.isArray(object[SplatSymbols.remainingArgs]))
    remainingArgs = object[SplatSymbols.remainingArgs];
  if (Array.isArray(object[SplatSymbols.extraArgs])) extraArgs = object[SplatSymbols.extraArgs];
  const makeArguments = (key, value) => {
    const option = `${options?.shortFlag && key.length === 1 ? "-" : options?.prefix}${options?.preserveCase ? key : dasherize(key)}`;
    if (options?.assign)
      optionValues.push(option + (value ? `${options.assign}${stringify(value)}` : ""));
    else {
      optionValues.push(option);
      if (value) optionValues.push(stringify(value));
    }
  };
  const makeAliasArg = (key, value) => {
    const option = key.startsWith("-") || key.startsWith("/") ? key : `-${key}`;
    if (options?.assign) optionValues.push(`${option}${options.assign}${stringify(value)}`);
    else {
      optionValues.push(option);
      if (value) optionValues.push(stringify(value));
    }
  };
  let isNoFlag = (_key) => false;
  if (options.noargs !== void 0) {
    options.noFlagValues ??= {
      t: "true",
      f: "false",
    };
    const noargs = options.noargs;
    isNoFlag = Array.isArray(noargs) ? (key) => noargs.includes(key) : () => true;
  }
  let positionalArgs = [];
  if (Array.isArray(object[SplatSymbols.args])) positionalArgs = object[SplatSymbols.args];
  else if (argumentNames.length > 0) positionalArgs.length = argumentNames.length;
  for (let [key, value] of Object.entries(object)) {
    let pushArguments = makeArguments;
    if (key === "*" || key === "_") {
      if (Array.isArray(value)) positionalArgs.push(...value);
      else if (typeof value === "string") positionalArgs.push(value);
      continue;
    }
    if (argumentNames.includes(key)) {
      let index = argumentNames.indexOf(key);
      if (value)
        if (Array.isArray(value))
          for (const item of value) positionalArgs[index++] = stringify(item);
        else positionalArgs[index] = stringify(value);
      continue;
    }
    if (Array.isArray(options.excludes) && match(options.excludes, key)) continue;
    if (Array.isArray(options.includes) && !match(options.includes, key)) continue;
    if (typeof options.aliases === "object" && options.aliases[key]) {
      key = options.aliases[key];
      pushArguments = makeAliasArg;
    }
    if (key === "--") {
      if (!Array.isArray(value))
        throw new TypeError(`Expected key \`--\` to be Array, got ${typeof value}`);
      extraArgs = value;
      continue;
    }
    if (key === "_") {
      if (typeof value === "string") {
        remainingArgs = [value];
        continue;
      }
      if (!Array.isArray(value))
        throw new TypeError(`Expected key \`_\` to be Array, got ${typeof value}`);
      remainingArgs = value;
      continue;
    }
    if (value === true && !options.ignoreTrue)
      pushArguments(key, isNoFlag(key) ? options.noFlagValues?.t : void 0);
    else if (value === false && !options.ignoreFalse)
      pushArguments(
        isNoFlag(key) ? key : `no-${key}`,
        isNoFlag(key) ? options.noFlagValues?.f : void 0,
      );
    else if (
      typeof value === "string" ||
      (typeof value === "number" && !Number.isNaN(value)) ||
      typeof value === "bigint"
    )
      pushArguments(key, String(value));
    else if (Array.isArray(value)) for (const item of value) pushArguments(key, item);
  }
  if (commands.length > 0) splatted.push(...commands);
  const normalizedArgs = positionalArgs.flatMap((arg) =>
    Array.isArray(arg) ? arg.map(stringify) : arg ? [stringify(arg)] : [],
  );
  if (!options.appendArguments) splatted.push(...normalizedArgs);
  splatted.push(...optionValues);
  if (options.appendArguments) splatted.push(...normalizedArgs);
  splatted.push(...remainingArgs.map(stringify));
  if (extraArgs.length > 0) splatted.push("--", ...extraArgs.map(stringify));
  return splatted;
}
//#endregion
export { SplatSymbols, splat };
