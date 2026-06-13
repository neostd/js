//#region src/parse.ts
const globals = globalThis;
function runtimeArgs() {
  if (globals.Deno) return globals.Deno.args;
  if (globals.process) return globals.process.argv.slice(2);
  return [];
}
function isOption(value) {
  return value.length > 1 && value.startsWith("-") && value !== "-";
}
function optionNames(name, aliases) {
  return [name, ...(aliases.get(name) ?? [])];
}
function addAlias(aliases, key, values) {
  const all = [key, ...(Array.isArray(values) ? values : [values])];
  for (const name of all)
    aliases.set(
      name,
      all.filter((item) => item !== name),
    );
}
function hasName(name, names) {
  return names === true || (Array.isArray(names) && names.includes(name));
}
function coerceValue(name, value, options) {
  if (typeof value === "boolean") return value;
  if (hasName(name, options.string)) return value;
  if (hasName(name, options.number)) {
    const numberValue = Number(value);
    return Number.isNaN(numberValue) ? value : numberValue;
  }
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?(?:\d+|\d*\.\d+)$/.test(value)) return Number(value);
  return value;
}
function setValue(result, name, value, aliases) {
  for (const key of optionNames(name, aliases)) {
    const current = result[key];
    if (current === void 0) result[key] = value;
    else if (Array.isArray(current)) current.push(value);
    else result[key] = [current, value];
  }
}
/**
 * Parses command-line arguments into a JSON-like object.
 *
 * The result is similar to popular CLI parsers: positional arguments are in `_`, long and short options become
 * properties, repeated options become arrays, `--no-name` becomes `{ name: false }`, and `--` can be preserved.
 *
 * @param argsOrOptions Arguments to parse, or options containing an `args` array. If omitted, the current runtime args
 * are used (`Deno.args` in Deno, `process.argv.slice(2)` in Node and Bun).
 * @param maybeOptions Options used when the first argument is an args array.
 * @returns Parsed arguments with positional values in `_`.
 *
 * @example
 * ```ts
 * import { parse } from "@neostd/args/parse";
 *
 * const args = parse(["--name", "neo", "--count=2", "-v", "input.txt"], { boolean: ["v"] });
 * // { _: ["input.txt"], name: "neo", count: 2, v: true }
 * ```
 */
function parse(argsOrOptions, maybeOptions = {}) {
  const options = Array.isArray(argsOrOptions)
    ? {
        ...maybeOptions,
        args: argsOrOptions,
      }
    : (argsOrOptions ?? {});
  const args = options.args ?? runtimeArgs();
  const aliases = /* @__PURE__ */ new Map();
  const result = { _: [] };
  if (options["--"]) result["--"] = [];
  for (const [key, value] of Object.entries(options.alias ?? {})) addAlias(aliases, key, value);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--") {
      const rest = args.slice(i + 1);
      if (options["--"]) result["--"]?.push(...rest);
      else result._.push(...rest);
      break;
    }
    if (!isOption(arg)) {
      result._.push(arg);
      if (options.stopEarly) {
        result._.push(...args.slice(i + 1));
        break;
      }
      continue;
    }
    if (arg.startsWith("--no-") && !arg.includes("=")) {
      setValue(result, arg.slice(5), false, aliases);
      continue;
    }
    if (arg.startsWith("--")) {
      const option = arg.slice(2);
      const equalsIndex = option.indexOf("=");
      const name = equalsIndex === -1 ? option : option.slice(0, equalsIndex);
      const value = equalsIndex === -1 ? void 0 : option.slice(equalsIndex + 1);
      if (value !== void 0) {
        setValue(result, name, coerceValue(name, value, options), aliases);
        continue;
      }
      if (hasName(name, options.boolean) || args[i + 1] === void 0 || isOption(args[i + 1])) {
        setValue(result, name, true, aliases);
        continue;
      }
      i += 1;
      setValue(result, name, coerceValue(name, args[i], options), aliases);
      continue;
    }
    const short = arg.slice(1);
    const equalsIndex = short.indexOf("=");
    if (equalsIndex !== -1) {
      const name = short.slice(0, equalsIndex);
      setValue(result, name, coerceValue(name, short.slice(equalsIndex + 1), options), aliases);
      continue;
    }
    if (short.length > 1) {
      for (const name of short) setValue(result, name, true, aliases);
      continue;
    }
    if (hasName(short, options.boolean) || args[i + 1] === void 0 || isOption(args[i + 1])) {
      setValue(result, short, true, aliases);
      continue;
    }
    i += 1;
    setValue(result, short, coerceValue(short, args[i], options), aliases);
  }
  for (const [key, value] of Object.entries(options.default ?? {}))
    if (result[key] === void 0)
      if (Array.isArray(value)) for (const item of value) setValue(result, key, item, aliases);
      else setValue(result, key, value, aliases);
  return result;
}
//#endregion
export { parse };
