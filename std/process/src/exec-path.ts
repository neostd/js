import { globals } from "./globals.ts";

let executablePath: string | undefined;

/**
 * Returns the path to the executable that started the current process.
 *
 * In Deno this returns an empty string unless read permission is already granted.
 */
export function execPath(): string {
  if (typeof executablePath === "string") {
    return executablePath;
  }

  if (globals.Deno) {
    try {
      const readPermission = globals.Deno.permissions.querySync({ name: "read" });
      executablePath = readPermission.state === "granted" ? globals.Deno.execPath() : "";
      return executablePath;
    } catch {
      executablePath = "";
      return executablePath;
    }
  }

  if (globals.process) {
    executablePath = globals.process.execPath;
    return executablePath;
  }

  executablePath = "";
  return executablePath;
}
