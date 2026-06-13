//#region src/globals.ts
const globals = globalThis;
function cwd() {
  if (globals.Deno?.cwd) return globals.Deno.cwd();
  if (globals.process?.cwd) return globals.process.cwd();
  if (globals.location) return globals.location.href;
  return "/";
}
//#endregion
export { cwd, globals };
