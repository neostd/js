import { LinuxKeyringBackend } from "./types.mjs";

//#region src/ffi_bun.d.ts
declare const backend: LinuxKeyringBackend;
//#endregion
export { backend };
