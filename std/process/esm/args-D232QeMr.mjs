import { a as globals } from "./globals-Deml3KGm.mjs";
//#region src/args.ts
let currentArgs = [];
if (globals.Deno) currentArgs = globals.Deno.args;
else if (globals.process) currentArgs = globals.process.argv.slice(2);
/**
 * The current process arguments without the executable path or script path.
 *
 * @example
 * ```ts
 * import { args } from "@neostd/process/args";
 * console.log(args);
 * ```
 */
const args = currentArgs;
//#endregion
export { args as t };
