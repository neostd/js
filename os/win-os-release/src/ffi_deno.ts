import type { DomainInfo, WinReleaseBackend, OsVersionInfo } from "./types.ts";
import { MachineRole, type ProductType } from "./types.ts";

const Deno_ = (globalThis as typeof globalThis & { Deno?: any }).Deno;
const ntdll = Deno_.dlopen("ntdll.dll", {
  RtlGetVersion: { parameters: ["buffer"], result: "i32" },
} as const);
const kernel32 = Deno_.dlopen("kernel32.dll", {
  GetProductInfo: { parameters: ["u32", "u32", "u32", "u32", "buffer"], result: "i32" },
} as const);
const netapi32 = Deno_.dlopen("netapi32.dll", {
  DsRoleGetPrimaryDomainInformation: { parameters: ["pointer", "u32", "buffer"], result: "u32" },
  DsRoleFreeMemory: { parameters: ["pointer"], result: "void" },
} as const);
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
function readWideString(ptr: bigint): string {
  if (ptr === 0n) return "";
  const unsafePtr = Deno_.UnsafePointer.create(ptr);
  if (unsafePtr === null) return "";
  const view = new Deno_.UnsafePointerView(unsafePtr);
  const chars: number[] = [];
  for (let i = 0; ; i += 2) {
    const lo = view.getUint8(i);
    const hi = view.getUint8(i + 1);
    if (lo === 0 && hi === 0) break;
    chars.push(lo | (hi << 8));
  }
  return String.fromCharCode(...chars);
}
function readBytes(ptr: bigint, length: number): Uint8Array {
  if (ptr === 0n || length === 0) return new Uint8Array(0);
  const unsafePtr = Deno_.UnsafePointer.create(ptr);
  if (unsafePtr === null) return new Uint8Array(0);
  const view = new Deno_.UnsafePointerView(unsafePtr);
  const buf = new Uint8Array(length);
  for (let i = 0; i < length; i++) buf[i] = view.getUint8(i);
  return buf;
}
export const backend: WinReleaseBackend = {
  getVersion(): OsVersionInfo {
    const buf = new Uint8Array(SIZEOF_OSVERSIONINFOEXW);
    const view = new DataView(buf.buffer);
    view.setUint32(0, SIZEOF_OSVERSIONINFOEXW, true);
    const status = ntdll.symbols.RtlGetVersion(buf);
    if (status !== 0) throw new Error(`RtlGetVersion failed with NTSTATUS ${status}`);
    const decoder = new TextDecoder("utf-16le");
    let csdEnd = OFF_CSD + 256;
    for (let i = OFF_CSD; i < OFF_CSD + 255; i += 2) {
      if (buf[i] === 0 && buf[i + 1] === 0) {
        csdEnd = i;
        break;
      }
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
      productType: buf[OFF_PRODUCT_TYPE] as ProductType,
    };
  },
  getProductInfo(
    majorVersion: number,
    minorVersion: number,
    spMajor: number,
    spMinor: number,
  ): number {
    const outBuf = new Uint8Array(4);
    kernel32.symbols.GetProductInfo(majorVersion, minorVersion, spMajor, spMinor, outBuf);
    return new DataView(outBuf.buffer).getUint32(0, true);
  },
  getDomainInfo(): DomainInfo {
    const outPtrBuf = new Uint8Array(8);
    const err = netapi32.symbols.DsRoleGetPrimaryDomainInformation(null, 1, outPtrBuf);
    if (err !== 0)
      return {
        machineRole: MachineRole.STANDALONE_WORKSTATION,
        flags: 0,
        domainNameFlat: "",
        domainNameDns: "",
        forestName: "",
      };
    const infoPtr = new DataView(outPtrBuf.buffer).getBigUint64(0, true);
    try {
      const infoBuf = readBytes(infoPtr, 48);
      const infoView = new DataView(infoBuf.buffer, infoBuf.byteOffset, infoBuf.byteLength);
      return {
        machineRole: infoView.getUint32(DS_OFF_MACHINE_ROLE, true) as MachineRole,
        flags: infoView.getUint32(DS_OFF_FLAGS, true),
        domainNameFlat: readWideString(infoView.getBigUint64(DS_OFF_DOMAIN_FLAT, true)),
        domainNameDns: readWideString(infoView.getBigUint64(DS_OFF_DOMAIN_DNS, true)),
        forestName: readWideString(infoView.getBigUint64(DS_OFF_FOREST, true)),
      };
    } finally {
      netapi32.symbols.DsRoleFreeMemory(Deno_.UnsafePointer.create(infoPtr));
    }
  },
};
