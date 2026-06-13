import { a as globals } from "./globals-Deml3KGm.mjs";
//#region src/exit.ts
/**
 * Exits the current process with an optional status code.
 *
 * Browser environments call `window.close()` when available.
 */
function exit(code) {
  if (globals.Deno) globals.Deno.exit(code);
  if (globals.process) globals.process.exit(code);
  globals.window?.close();
}
//#endregion
export { exit as t };
