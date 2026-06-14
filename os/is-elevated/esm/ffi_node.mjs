import process from "node:process";
//#region src/ffi_node.ts
const { createRequire } = process.getBuiltinModule("node:module");
const ffi = createRequire(import.meta.url)("node:ffi");
const advapi32 = ffi.dlopen("Advapi32.dll", {
  OpenProcessToken: {
    parameters: ["pointer", "u32", "pointer"],
    result: "u8",
  },
  GetTokenInformation: {
    parameters: ["pointer", "u32", "pointer", "u32", "pointer"],
    result: "u8",
  },
});
const kernel32 = ffi.dlopen("Kernel32.dll", {
  GetCurrentProcess: {
    parameters: [],
    result: "pointer",
  },
  CloseHandle: {
    parameters: ["pointer"],
    result: "u8",
  },
  GetLastError: {
    parameters: [],
    result: "u32",
  },
});
let elevated;
function evalIsProcessElevated(cache = true) {
  if (cache && elevated !== void 0) return elevated;
  const TOKEN_QUERY = 8;
  const TOKEN_ELEVATION = 20;
  const processHandle = kernel32.functions.GetCurrentProcess();
  const tokenHandleBuf = new Uint8Array(8);
  if (!advapi32.functions.OpenProcessToken(processHandle, TOKEN_QUERY, tokenHandleBuf))
    throw new Error(`Failed to open process token (${kernel32.functions.GetLastError()})`);
  const tokenHandle = new DataView(tokenHandleBuf.buffer).getBigUint64(0, true);
  try {
    const tokenInfo = new Uint8Array(4);
    const returnLength = new Uint8Array(4);
    if (
      !advapi32.functions.GetTokenInformation(
        tokenHandle,
        TOKEN_ELEVATION,
        tokenInfo,
        4,
        returnLength,
      )
    )
      throw new Error(`Failed to get token information (${kernel32.functions.GetLastError()})`);
    elevated = tokenInfo[0] !== 0;
    return elevated;
  } finally {
    kernel32.functions.CloseHandle(tokenHandle);
  }
}
//#endregion
export { evalIsProcessElevated };
