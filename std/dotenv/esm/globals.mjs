//#region src/globals.ts
const globalObject = globalThis;
const globals = globalObject;
const WINDOWS =
  globalObject.Deno?.build?.os === "windows" ||
  globalObject.process?.platform === "win32" ||
  globalObject.navigator?.platform?.toLowerCase().includes("win") === true;
const EOL = WINDOWS ? "\r\n" : "\n";
//#endregion
export { EOL, WINDOWS, globals };
