import { DarwinKeychainBackend } from "./types.mjs";

//#region src/ffi_bun.d.ts
declare const backend: DarwinKeychainBackend;
//#endregion
export { backend };
