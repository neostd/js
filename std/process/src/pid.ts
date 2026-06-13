import { globals } from "./globals.ts";

let id = 0;

if (globals.Deno) {
  id = globals.Deno.pid;
} else if (globals.process) {
  id = globals.process.pid;
}

/** The current process ID, or `0` in browser environments. */
export const pid: number = id;
