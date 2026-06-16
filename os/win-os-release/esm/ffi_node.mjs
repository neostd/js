import "./types.mjs";
import { createRequire } from "node:module";
//#region src/ffi_node.ts
const ffi = createRequire(import.meta.url)("node:ffi");
const ntdll = ffi.dlopen("ntdll.dll", {
  RtlGetVersion: {
    parameters: ["pointer"],
    result: "i32",
  },
});
const kernel32 = ffi.dlopen("kernel32.dll", {
  GetProductInfo: {
    parameters: ["u32", "u32", "u32", "u32", "pointer"],
    result: "i32",
  },
});
const netapi32 = ffi.dlopen("netapi32.dll", {
  DsRoleGetPrimaryDomainInformation: {
    parameters: ["pointer", "u32", "pointer"],
    result: "u32",
  },
  DsRoleFreeMemory: {
    parameters: ["pointer"],
    result: "void",
  },
});
const SIZEOF_OSVERSIONINFOEXW = 284;
const OFF_MAJOR = 4;
const OFF_MINOR = 8;
const OFF_BUILD = 12;
const OFF_PLATFORM = 16;
const OFF_CSD = 20;
const OFF_SP_MAJOR = 276;
const OFF_SP_MINOR = 278;
const OFF_SUITE = 280;
const OFF_PRODUCT_TYPE = 282;
const DS_OFF_MACHINE_ROLE = 0;
const DS_OFF_FLAGS = 4;
const DS_OFF_DOMAIN_FLAT = 8;
const DS_OFF_DOMAIN_DNS = 16;
const DS_OFF_FOREST = 24;
function readWideString(ptr) {
  if (ptr === 0n) return "";
  const chars = [];
  for (let i = 0; ; i += 2) {
    const lo = ffi.getUint8(ptr, i);
    const hi = ffi.getUint8(ptr, i + 1);
    if (lo === 0 && hi === 0) break;
    chars.push(lo | (hi << 8));
  }
  return String.fromCharCode(...chars);
}
const backend = {
  getVersion() {
    const buf = new Uint8Array(SIZEOF_OSVERSIONINFOEXW);
    const view = new DataView(buf.buffer);
    view.setUint32(0, SIZEOF_OSVERSIONINFOEXW, true);
    const status = ntdll.functions.RtlGetVersion(buf);
    if (status !== 0) throw new Error(`RtlGetVersion failed with NTSTATUS ${status}`);
    const decoder = new TextDecoder("utf-16le");
    let csdEnd = 276;
    for (let i = OFF_CSD; i < 275; i += 2)
      if (buf[i] === 0 && buf[i + 1] === 0) {
        csdEnd = i;
        break;
      }
    return {
      majorVersion: view.getUint32(OFF_MAJOR, true),
      minorVersion: view.getUint32(OFF_MINOR, true),
      buildNumber: view.getUint32(OFF_BUILD, true),
      platformId: view.getUint32(OFF_PLATFORM, true),
      csdVersion: decoder.decode(buf.subarray(OFF_CSD, csdEnd)),
      servicePackMajor: view.getUint16(OFF_SP_MAJOR, true),
      servicePackMinor: view.getUint16(OFF_SP_MINOR, true),
      suiteMask: view.getUint16(OFF_SUITE, true),
      productType: buf[OFF_PRODUCT_TYPE],
    };
  },
  getProductInfo(majorVersion, minorVersion, spMajor, spMinor) {
    const outBuf = new Uint8Array(4);
    kernel32.functions.GetProductInfo(majorVersion, minorVersion, spMajor, spMinor, outBuf);
    return new DataView(outBuf.buffer).getUint32(0, true);
  },
  getDomainInfo() {
    const outPtrBuf = new Uint8Array(8);
    if (netapi32.functions.DsRoleGetPrimaryDomainInformation(null, 1, outPtrBuf) !== 0)
      return {
        machineRole: 0,
        flags: 0,
        domainNameFlat: "",
        domainNameDns: "",
        forestName: "",
      };
    const infoPtr = new DataView(outPtrBuf.buffer).getBigUint64(0, true);
    try {
      return {
        machineRole: ffi.getUint32(infoPtr, DS_OFF_MACHINE_ROLE),
        flags: ffi.getUint32(infoPtr, DS_OFF_FLAGS),
        domainNameFlat: readWideString(ffi.getUint64(infoPtr, DS_OFF_DOMAIN_FLAT)),
        domainNameDns: readWideString(ffi.getUint64(infoPtr, DS_OFF_DOMAIN_DNS)),
        forestName: readWideString(ffi.getUint64(infoPtr, DS_OFF_FOREST)),
      };
    } finally {
      netapi32.functions.DsRoleFreeMemory(infoPtr);
    }
  },
};
//#endregion
export { backend };
