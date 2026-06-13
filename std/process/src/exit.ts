import { globals } from "./globals.ts";

/**
 * Exits the current process with an optional status code.
 *
 * Browser environments call `window.close()` when available.
 */
export function exit(code?: number): void {
  if (globals.Deno) {
    globals.Deno.exit(code);
  }

  if (globals.process) {
    globals.process.exit(code);
  }

  globals.window?.close();
}
