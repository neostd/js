import { LinuxKeyringBackend } from "./types.mjs";

//#region src/ffi_node.d.ts
declare const backend: LinuxKeyringBackend;
//#endregion
export { backend };
