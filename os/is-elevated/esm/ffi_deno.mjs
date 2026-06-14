//#region src/ffi_deno.ts
let elevated;
function evalIsProcessElevated(cache = true) {
  if (!cache || elevated === void 0) elevated = globalThis.Deno.uid() === 0;
  if (globalThis.Deno.build.os !== "windows") return elevated;
  const deno = globalThis.Deno;
  const advapi32 = deno.dlopen("Advapi32.dll", {
    OpenProcessToken: {
      parameters: ["pointer", "u32", "pointer"],
      result: "bool",
    },
    GetTokenInformation: {
      parameters: ["u64", "u32", "pointer", "u32", "pointer"],
      result: "bool",
    },
  });
  const kernel32 = deno.dlopen("Kernel32.dll", {
    GetCurrentProcess: {
      parameters: [],
      result: "pointer",
    },
    CloseHandle: {
      parameters: ["pointer"],
      result: "bool",
    },
    GetLastError: {
      parameters: [],
      result: "i32",
    },
  });
  const TOKEN_QUERY = 8;
  const TOKEN_ELEVATION = 20;
  const processHandle = kernel32.symbols.GetCurrentProcess();
  const tokenHandle = new BigUint64Array(1);
  const tokenHandlePtr = deno.UnsafePointer.of(tokenHandle);
  if (!advapi32.symbols.OpenProcessToken(processHandle, TOKEN_QUERY, tokenHandlePtr))
    throw new Error("Failed to open process token");
  try {
    const tokenInfo = new Uint8Array(4);
    const returnLength = new Uint32Array(1);
    if (
      !advapi32.symbols.GetTokenInformation(
        tokenHandle[0],
        TOKEN_ELEVATION,
        deno.UnsafePointer.of(tokenInfo),
        4,
        deno.UnsafePointer.of(returnLength),
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
