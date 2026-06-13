import { globals } from "./globals.ts";

export type KillSignal = NodeJS.Signals | number;

/**
 * Sends a signal to a process.
 *
 * Returns `false` in browser environments because browsers cannot signal OS processes.
 */
export function kill(pid: number, signal?: KillSignal): boolean {
  if (globals.Deno) {
    globals.Deno.kill(pid, signal);
    return true;
  }

  if (globals.process) {
    return globals.process.kill(pid, signal);
  }

  return false;
}
