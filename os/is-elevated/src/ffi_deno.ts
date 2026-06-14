let elevated: boolean | undefined;

export function evalIsProcessElevated(cache = true): boolean {
  if (!cache || elevated === undefined) {
    const d = (globalThis as typeof globalThis & { Deno?: any }).Deno;
    elevated = d.uid() === 0;
  }

  const d = (globalThis as typeof globalThis & { Deno?: any }).Deno;
  if (d.build.os !== "windows") {
    return elevated;
  }

  const deno = (globalThis as typeof globalThis & { Deno?: any }).Deno;
  const advapi32 = deno.dlopen("Advapi32.dll", {
    OpenProcessToken: { parameters: ["pointer", "u32", "pointer"], result: "bool" },
    GetTokenInformation: {
      parameters: ["u64", "u32", "pointer", "u32", "pointer"],
      result: "bool",
    },
  });

  const kernel32 = deno.dlopen("Kernel32.dll", {
    GetCurrentProcess: { parameters: [], result: "pointer" },
    CloseHandle: { parameters: ["pointer"], result: "bool" },
    GetLastError: { parameters: [], result: "i32" },
  });

  const TOKEN_QUERY = 0x0008;
  const TOKEN_ELEVATION = 20;
  const processHandle = kernel32.symbols.GetCurrentProcess();
  const tokenHandle = new BigUint64Array(1);
  const tokenHandlePtr = deno.UnsafePointer.of(tokenHandle);

  const success = advapi32.symbols.OpenProcessToken(processHandle, TOKEN_QUERY, tokenHandlePtr);
  if (!success) throw new Error("Failed to open process token");

  try {
    const tokenInfo = new Uint8Array(4);
    const returnLength = new Uint32Array(1);
    const result = advapi32.symbols.GetTokenInformation(
      tokenHandle[0],
      TOKEN_ELEVATION,
      deno.UnsafePointer.of(tokenInfo),
      4,
      deno.UnsafePointer.of(returnLength),
    );
    if (!result)
      throw new Error(`Failed to get token information ${kernel32.symbols.GetLastError()}`);
    elevated = tokenInfo[0] !== 0;
    return elevated;
  } finally {
    kernel32.symbols.CloseHandle(tokenHandlePtr);
  }
}
