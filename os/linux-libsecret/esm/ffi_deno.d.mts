import { LinuxKeyringBackend } from "./types.mjs";

//#region src/ffi_deno.d.ts
declare const backend: LinuxKeyringBackend;
//#endregion
export { backend };
