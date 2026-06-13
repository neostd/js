import { a as globals } from "./globals-Deml3KGm.mjs";
//#region src/kill.ts
/**
 * Sends a signal to a process.
 *
 * Returns `false` in browser environments because browsers cannot signal OS processes.
 */
function kill(pid, signal) {
  if (globals.Deno) {
    globals.Deno.kill(pid, signal);
    return true;
  }
  if (globals.process) return globals.process.kill(pid, signal);
  return false;
}
//#endregion
export { kill as t };
