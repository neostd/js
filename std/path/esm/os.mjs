import { globals } from "./globals.mjs";
//#region src/os.ts
const isWindows =
  globals.Deno?.build?.os === "windows" ||
  globals.navigator?.platform?.startsWith("Win") ||
  globals.process?.platform?.startsWith("win") ||
  false;
//#endregion
export { isWindows };
