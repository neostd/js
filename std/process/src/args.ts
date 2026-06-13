import { globals } from "./globals.ts";

let currentArgs: string[] = [];

if (globals.Deno) {
  currentArgs = globals.Deno.args;
} else if (globals.process) {
  currentArgs = globals.process.argv.slice(2);
}

/**
 * The current process arguments without the executable path or script path.
 *
 * @example
 * ```ts
 * import { args } from "@neostd/process/args";
 * console.log(args);
 * ```
 */
export const args: ReadonlyArray<string> = currentArgs;
