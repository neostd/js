import { a as globals } from "./globals-Deml3KGm.mjs";
//#region src/cwd.ts
/**
 * Gets the current working directory of the process.
 *
 * In browser environments this returns the last URL stored in history state or `location.pathname`.
 */
function cwd() {
  if (globals.Deno) return globals.Deno.cwd();
  if (globals.process) return globals.process.cwd();
  if (globals.navigator && globals.window) {
    const state = globals.window.history.state;
    if (state?.url) return state.url;
    return globals.window.location.pathname;
  }
  throw new Error("cwd is not implemented");
}
//#endregion
export { cwd as t };
