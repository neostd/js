import { a as globals } from "./globals-Deml3KGm.mjs";
//#region src/pid.ts
let id = 0;
if (globals.Deno) id = globals.Deno.pid;
else if (globals.process) id = globals.process.pid;
/** The current process ID, or `0` in browser environments. */
const pid = id;
//#endregion
export { pid as t };
