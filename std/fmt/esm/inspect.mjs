import { globals } from "./globals.mjs";
import { createRequire } from "node:module";
//#region src/inspect.ts
const nodeUtil = (() => {
  if (globals.Bun && typeof globals.Bun.inspect === "function")
    return {
      inspect(value, options) {
        return globals.Bun.inspect(value, options);
      },
    };
  if (globals.process && typeof globals.process.getBuiltinModule === "function")
    return globals.process.getBuiltinModule("node:util");
  try {
    return createRequire(import.meta.url)("node:util");
  } catch {
    return {
      inspect(value) {
        return JSON.stringify(value, null, 2);
      },
    };
  }
})();
function inspect(value, options) {
  options ??= {};
  if (typeof globals.Deno !== "undefined") return globals.Deno.inspect(value, options);
  if (globals.process) {
    let compact = 3;
    if (options.compact === false) compact = false;
    else if (options.compact === true) compact = true;
    const o = {
      compact,
      depth: options.depth ?? 4,
      colors: options.colors ?? false,
    };
    for (const key in options) {
      if (
        !Object.prototype.hasOwnProperty.call(options, key) ||
        key === "compact" ||
        key === "depth"
      )
        continue;
      switch (key) {
        case "iterableLimit":
          o.maxArrayLength = options.iterableLimit;
          break;
        case "strAbbreviateSize":
          o.maxStringLength = options.strAbbreviateSize;
          break;
        case "escapeSequences":
          o.numericSeparator = options.escapeSequences;
          break;
        default:
          o[key] = options[key];
          break;
      }
    }
    return nodeUtil.inspect(value, o);
  }
  return JSON.stringify(value, null, 2);
}
//#endregion
export { inspect };
