import process from "node:process";
//#region src/ffi_koffi.ts
const { createRequire } = process.getBuiltinModule("node:module");
const koffi = createRequire(import.meta.url)("koffi");
const advapi32 = koffi.load("Advapi32.dll");
const kernel32 = koffi.load("Kernel32.dll");
const OpenProcessToken = advapi32.func(
  "int __stdcall OpenProcessToken(void *ProcessHandle, uint32 DesiredAccess, _Out_ void **TokenHandle)",
);
const GetTokenInformation = advapi32.func(
  "int __stdcall GetTokenInformation(void *TokenHandle, uint32 TokenInformationClass, void *TokenInformation, uint32 TokenInformationLength, _Out_ uint32 *ReturnLength)",
);
const GetCurrentProcess = kernel32.func("void * __stdcall GetCurrentProcess()");
const CloseHandle = kernel32.func("int __stdcall CloseHandle(void *hObject)");
const GetLastError = kernel32.func("uint32 __stdcall GetLastError()");
let elevated;
function evalIsProcessElevated(cache = true) {
  if (cache && elevated !== void 0) return elevated;
  const TOKEN_QUERY = 8;
  const TOKEN_ELEVATION = 20;
  const processHandle = GetCurrentProcess();
  const tokenOut = [null];
  if (!OpenProcessToken(processHandle, TOKEN_QUERY, tokenOut))
    throw new Error(`Failed to open process token (${GetLastError()})`);
  try {
    const tokenInfo = new Uint8Array(4);
    if (!GetTokenInformation(tokenOut[0], TOKEN_ELEVATION, tokenInfo, 4, [0]))
      throw new Error(`Failed to get token information (${GetLastError()})`);
    elevated = tokenInfo[0] !== 0;
    return elevated;
  } finally {
    if (tokenOut[0]) CloseHandle(tokenOut[0]);
  }
}
//#endregion
export { evalIsProcessElevated };
