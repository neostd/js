/**
 * Detect whether the current process is running with elevated privileges.
 *
 * On Unix-like systems this typically means the process is running as root. On
 * Windows it means the current process token is elevated.
 *
 * @example Usage
 * ```ts
 * import { isElevated } from "@neostd/is-elevated";
 *
 * if (!isElevated()) {
 *   throw new Error("This action requires sudo or admin rights");
 * }
 * ```
 *
 * @module
 */

const globals = globalThis as typeof globalThis &
  Record<string, unknown> & {
    process?: Record<string, any> & {
      env?: Record<string, string | undefined>;
      getBuiltinModule?: (name: string) => unknown;
    };
    Deno: Record<string, unknown>;
    Bun: Record<string, unknown>;
  };
const processObject = globals.process as
  | {
      env?: Record<string, string | undefined>;
      getBuiltinModule?: (name: string) => unknown;
    }
  | undefined;

let impl = function (_cache = true): boolean {
  return false;
};

if (typeof globals.process !== "undefined") {
  const { createRequire } = process.getBuiltinModule("node:module") as typeof import("node:module");
  const require = createRequire(import.meta.url);

  if (typeof globals.Deno !== "undefined" && processObject?.getBuiltinModule) {
    const { evalIsProcessElevated } = require("./ffi_deno.ts") as typeof import("./ffi_deno.ts");
    impl = evalIsProcessElevated;
  } else if (typeof globals.Bun !== "undefined" && processObject?.getBuiltinModule) {
    const { evalIsProcessElevated } = require("./ffi_bun.ts") as typeof import("./ffi_bun.ts");
    impl = evalIsProcessElevated;
  } else if (processObject?.getBuiltinModule) {
    try {
      if (processObject.getBuiltinModule("node:ffi")) {
        const { evalIsProcessElevated } =
          require("./ffi_node.ts") as typeof import("./ffi_node.ts");
        impl = evalIsProcessElevated;
      } else {
        const { evalIsProcessElevated } =
          require("./ffi_koffi.ts") as typeof import("./ffi_koffi.ts");
        impl = evalIsProcessElevated;
      }
    } catch (error) {
      if (processObject.env?.DEBUG === "true") {
        console.debug(error);
      }
    }
  }
}

/**
 * Determines whether the current process is elevated.
 *
 * @example Usage
 * ```ts
 * import { isElevated } from "@neostd/is-elevated";
 *
 * if (isElevated()) {
 *   console.log("Running with elevated privileges");
 * }
 * ```
 *
 * @param cache When `true`, reuse the cached detection result from the selected runtime implementation.
 * @returns `true` when the current process is elevated, otherwise `false`.
 */
export function isElevated(cache = true): boolean {
  return impl(cache);
}
