import { FFIType, dlopen, ptr } from "bun:ffi";
//#region src/ffi_bun.ts
let elevated;
function evalIsProcessElevated(cache = true) {
  if (cache && elevated !== void 0) return elevated;
  elevated = globalThis.process?.getuid?.() === 0;
  if (!globalThis.Bun) return elevated;
  if (globalThis.process?.platform !== "win32") return elevated;
  const advapi32 = dlopen("Advapi32.dll", {
    OpenProcessToken: {
      args: [FFIType.ptr, FFIType.u32, FFIType.ptr],
      returns: FFIType.bool,
    },
    GetTokenInformation: {
      args: [FFIType.u64, FFIType.u32, FFIType.ptr, FFIType.u32, FFIType.ptr],
      returns: FFIType.bool,
    },
  });
  const kernel32 = dlopen("Kernel32.dll", {
    GetCurrentProcess: {
      args: [],
      returns: FFIType.ptr,
    },
    CloseHandle: {
      args: [FFIType.ptr],
      returns: FFIType.bool,
    },
    GetLastError: {
      args: [],
      returns: FFIType.i32,
    },
  });
  const TOKEN_QUERY = 8;
  const TOKEN_ELEVATION = 20;
  const processHandle = kernel32.symbols.GetCurrentProcess();
  const tokenHandle = new BigUint64Array(1);
  const tokenHandlePtr = ptr(tokenHandle);
  if (!advapi32.symbols.OpenProcessToken(processHandle, TOKEN_QUERY, tokenHandlePtr))
    throw new Error("Failed to open process token");
  try {
    const tokenInfo = new Uint8Array(4);
    const returnLength = new Uint32Array(1);
    if (
      !advapi32.symbols.GetTokenInformation(
        tokenHandle[0],
        TOKEN_ELEVATION,
        ptr(tokenInfo),
        4,
        ptr(returnLength),
      )
    )
      throw new Error(`Failed to get token information ${kernel32.symbols.GetLastError()}`);
    elevated = tokenInfo[0] !== 0;
    return elevated;
  } finally {
    kernel32.symbols.CloseHandle(tokenHandlePtr);
  }
}
//#endregion
export { evalIsProcessElevated };
