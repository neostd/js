import { globals } from "./globals.ts";
import { createRequire } from "node:module";

export interface InspectOptions {
  colors?: boolean;
  compact?: boolean;
  depth?: number;
  breakLength?: number;
  escapeSequences?: boolean;
  iterableLimit?: number;
  showProxy?: boolean;
  sorted?: boolean;
  trailingComma?: boolean;
  getters?: boolean;
  showHidden?: boolean;
  strAbbreviateSize?: number;
}

const nodeUtil = (() => {
  if (globals.Bun && typeof (globals.Bun as { inspect?: unknown }).inspect === "function") {
    return {
      inspect(value: unknown, options?: Record<string, unknown>): string {
        return (
          globals.Bun as { inspect(value: unknown, options?: Record<string, unknown>): string }
        ).inspect(value, options);
      },
    };
  }

  if (
    globals.process &&
    typeof (globals.process as { getBuiltinModule?: (name: string) => unknown })
      .getBuiltinModule === "function"
  ) {
    return (
      globals.process as {
        getBuiltinModule: (name: string) => {
          inspect(value: unknown, options?: Record<string, unknown>): string;
        };
      }
    ).getBuiltinModule("node:util");
  }

  try {
    const require = createRequire(import.meta.url);
    return require("node:util") as {
      inspect(value: unknown, options?: Record<string, unknown>): string;
    };
  } catch {
    return {
      inspect(value: unknown): string {
        return JSON.stringify(value, null, 2);
      },
    };
  }
})();

export function inspect(value: unknown, options?: InspectOptions): string {
  options ??= {};

  if (typeof globals.Deno !== "undefined") {
    return (globals.Deno as { inspect(value: unknown, options?: InspectOptions): string }).inspect(
      value,
      options,
    );
  }

  if (globals.process) {
    let compact: number | boolean = 3;
    if (options.compact === false) compact = false;
    else if (options.compact === true) compact = true;

    const o: Record<string, unknown> = {
      compact,
      depth: options.depth ?? 4,
      colors: options.colors ?? false,
    };

    for (const key in options) {
      if (
        !Object.prototype.hasOwnProperty.call(options, key) ||
        key === "compact" ||
        key === "depth"
      ) {
        continue;
      }

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
          o[key] = options[key as keyof InspectOptions];
          break;
      }
    }

    return nodeUtil.inspect(value, o);
  }

  return JSON.stringify(value, null, 2);
}
