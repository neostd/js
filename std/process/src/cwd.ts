import { globals } from "./globals.ts";

/**
 * Gets the current working directory of the process.
 *
 * In browser environments this returns the last URL stored in history state or `location.pathname`.
 */
export function cwd(): string {
  if (globals.Deno) {
    return globals.Deno.cwd();
  }

  if (globals.process) {
    return globals.process.cwd();
  }

  if (globals.navigator && globals.window) {
    const state = globals.window.history.state as { url?: string } | null;
    if (state?.url) {
      return state.url;
    }

    return globals.window.location.pathname;
  }

  throw new Error("cwd is not implemented");
}
