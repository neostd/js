import { a as globals } from "./globals-Deml3KGm.mjs";
//#region src/exec-path.ts
let executablePath;
/**
 * Returns the path to the executable that started the current process.
 *
 * In Deno this returns an empty string unless read permission is already granted.
 */
function execPath() {
  if (typeof executablePath === "string") return executablePath;
  if (globals.Deno)
    try {
      executablePath =
        globals.Deno.permissions.querySync({ name: "read" }).state === "granted"
          ? globals.Deno.execPath()
          : "";
      return executablePath;
    } catch {
      executablePath = "";
      return executablePath;
    }
  if (globals.process) {
    executablePath = globals.process.execPath;
    return executablePath;
  }
  executablePath = "";
  return executablePath;
}
//#endregion
export { execPath as t };
