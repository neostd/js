import "./types.mjs";
//#region src/os_release.ts
const globals = globalThis;
let isSupported = false;
let backend = {
  getVersion() {
    return {
      majorVersion: 0,
      minorVersion: 0,
      buildNumber: 0,
      platformId: 0,
      csdVersion: "",
      servicePackMajor: 0,
      servicePackMinor: 0,
      suiteMask: 0,
      productType: 1,
    };
  },
  getProductInfo(_majorVersion, _minorVersion, _spMajor, _spMinor) {
    return 0;
  },
  getDomainInfo() {
    return {
      machineRole: 0,
      flags: 0,
      domainNameFlat: "",
      domainNameDns: "",
      forestName: "",
    };
  },
};
if (globals.process?.platform === "win32" && globals.process.getBuiltinModule) {
  const { createRequire } = globals.process.getBuiltinModule("node:module");
  const require = createRequire(import.meta.url);
  if (typeof globals.Deno !== "undefined") {
    backend = require("./ffi_deno.ts").backend;
    isSupported = true;
  } else if (typeof globals.Bun !== "undefined") {
    backend = require("./ffi_bun.ts").backend;
    isSupported = true;
  } else
    try {
      if (globals.process.getBuiltinModule("node:ffi")) {
        backend = require("./ffi_node.ts").backend;
        isSupported = true;
      } else {
        backend = require("./ffi_koffi.ts").backend;
        isSupported = true;
      }
    } catch (error) {
      if (globals.process.env?.DEBUG === "true") console.debug(error);
    }
}
function buildToDisplayVersion(build, isServer) {
  if (isServer) {
    if (build >= 26100) return "Windows Server 2025";
    if (build >= 20348) return "Windows Server 2022";
    if (build >= 17763) return "Windows Server 2019";
    if (build >= 14393) return "Windows Server 2016";
    return "Windows Server";
  }
  if (build >= 22e3) return "Windows 11";
  if (build >= 10240) return "Windows 10";
  return "Windows";
}
function getEditionSuffix(edition) {
  switch (edition) {
    case 101:
    case 98:
    case 100:
      return "Home";
    case 48:
    case 49:
      return "Pro";
    case 161:
    case 162:
      return "Pro for Workstations";
    case 164:
      return "Pro Education";
    case 121:
    case 122:
      return "Education";
    case 4:
      return "Enterprise";
    case 125:
    case 126:
      return "Enterprise LTSC";
    case 11:
      return "Starter";
    case 7:
    case 13:
    case 168:
      return "Standard";
    case 8:
    case 12:
    case 167:
      return "Datacenter";
    case 10:
    case 14:
      return "Enterprise";
    case 17:
      return "Web Server";
    case 59:
      return "Essentials";
    case 18:
      return "HPC Edition";
    case 123:
    case 188:
    case 191:
      return "IoT Enterprise";
    case 2:
    case 5:
      return "Home Basic";
    case 3:
      return "Home Premium";
    case 1:
      return "Ultimate";
    case 6:
      return "Business";
    default:
      return "";
  }
}
function buildDisplayName(version, productEdition, isServer) {
  const base = buildToDisplayVersion(version.buildNumber, isServer);
  const suffix = getEditionSuffix(productEdition);
  return suffix ? `${base} ${suffix}` : base;
}
function buildVariant(productType, machineRole) {
  if (productType === 2 || machineRole === 5 || machineRole === 4) return "Domain Controller";
  if (productType === 3) return "Server";
  return "Workstation";
}
function buildCodeName(build, isServer) {
  if (isServer) {
    if (build >= 26100) return "server2025";
    if (build >= 20348) return "server2022";
    if (build >= 17763) return "server2019";
    if (build >= 14393) return "server2016";
    return "server";
  }
  if (build >= 22e3) return "win11";
  if (build >= 10240) return "win10";
  return "windows";
}
function formatOsRelease(displayName, variant, codeName) {
  return [
    "ID=windows",
    'NAME="Windows"',
    `PRETTY_NAME="${displayName}"`,
    `VARIANT="${variant}"`,
    `VERSION_CODENAME="${codeName}"`,
  ].join("\n");
}
function buildOsReleaseLike(displayName, variant, codeName) {
  return {
    id: "windows",
    name: "Windows",
    prettyName: displayName,
    variant,
    codeName,
  };
}
/**
 * Returns whether a Windows OS release backend is available in the current runtime.
 *
 * @returns `true` when Windows OS release detection is supported.
 */
function isAvailable() {
  return isSupported;
}
/**
 * Reads the raw Windows version information.
 *
 * @returns The Windows version information structure.
 */
function getWindowsVersion() {
  return backend.getVersion();
}
/**
 * Resolves the Windows product edition for a version.
 *
 * @param version Optional version information.
 * @returns The Windows product edition code.
 */
function getWindowsProductEdition(version) {
  const v = version ?? backend.getVersion();
  return backend.getProductInfo(
    v.majorVersion,
    v.minorVersion,
    v.servicePackMajor,
    v.servicePackMinor,
  );
}
/**
 * Reads Windows domain and machine role information.
 *
 * @returns The domain information.
 */
function getWindowsDomainInfo() {
  return backend.getDomainInfo();
}
/**
 * Returns whether the OS is a Windows Server edition.
 *
 * @param verInfo Optional version information.
 * @returns `true` when the OS is a server edition.
 */
function isWindowsServer(verInfo) {
  const v = verInfo ?? backend.getVersion();
  return v.productType === 3 || v.productType === 2;
}
/**
 * Returns whether the OS is a Windows domain controller.
 *
 * @param verInfo Optional version information.
 * @returns `true` when the OS is a domain controller.
 */
function isWindowsDomainController(verInfo) {
  return (verInfo ?? backend.getVersion()).productType === 2;
}
/**
 * Returns whether the OS is a Windows workstation edition.
 *
 * @param verInfo Optional version information.
 * @returns `true` when the OS is a workstation.
 */
function isWindowsWorkstation(verInfo) {
  return (verInfo ?? backend.getVersion()).productType === 1;
}
/**
 * Returns whether the machine is domain joined.
 *
 * @param domainInfo Optional domain information.
 * @returns `true` when the machine is joined to a domain.
 */
function isWindowsDomainJoined(domainInfo) {
  const d = domainInfo ?? backend.getDomainInfo();
  return d.machineRole === 1 || d.machineRole === 3 || d.machineRole === 5 || d.machineRole === 4;
}
/**
 * Builds a structured Windows OS release summary.
 *
 * @example Usage
 * ```ts
 * import { getWindowsOsRelease } from "@neostd/win-os-release";
 *
 * const release = getWindowsOsRelease();
 * console.log(release.displayName);
 * ```
 *
 * @param verInfo Optional version information.
 * @param domainInfo Optional domain information.
 * @returns The structured Windows OS release summary.
 */
function getWindowsOsRelease(verInfo, domainInfo) {
  const version = verInfo ?? backend.getVersion();
  const productEdition = backend.getProductInfo(
    version.majorVersion,
    version.minorVersion,
    version.servicePackMajor,
    version.servicePackMinor,
  );
  const domain = domainInfo ?? backend.getDomainInfo();
  const isServer = version.productType === 3 || version.productType === 2;
  return {
    version,
    productEdition,
    domain,
    isServer,
    isDomainController:
      version.productType === 2 || domain.machineRole === 5 || domain.machineRole === 4,
    isWorkstation: version.productType === 1,
    displayName: buildDisplayName(version, productEdition, isServer),
  };
}
/**
 * Builds Linux-style `os-release` text from Windows version data.
 *
 * @param verInfo Optional version information.
 * @param domainInfo Optional domain information.
 * @returns The generated `os-release` text.
 */
function getWindowsOsReleaseText(verInfo, domainInfo) {
  const version = verInfo ?? backend.getVersion();
  const productEdition = backend.getProductInfo(
    version.majorVersion,
    version.minorVersion,
    version.servicePackMajor,
    version.servicePackMinor,
  );
  const domain = domainInfo ?? backend.getDomainInfo();
  const isServer = version.productType === 3 || version.productType === 2;
  return formatOsRelease(
    buildDisplayName(version, productEdition, isServer),
    buildVariant(version.productType, domain.machineRole),
    buildCodeName(version.buildNumber, isServer),
  );
}
/**
 * Builds a JSON-friendly `os-release` view from Windows version data.
 *
 * @param verInfo Optional version information.
 * @param domainInfo Optional domain information.
 * @returns The generated `os-release` object.
 */
function getWindowsOsReleaseJson(verInfo, domainInfo) {
  const version = verInfo ?? backend.getVersion();
  const productEdition = backend.getProductInfo(
    version.majorVersion,
    version.minorVersion,
    version.servicePackMajor,
    version.servicePackMinor,
  );
  const domain = domainInfo ?? backend.getDomainInfo();
  const isServer = version.productType === 3 || version.productType === 2;
  return buildOsReleaseLike(
    buildDisplayName(version, productEdition, isServer),
    buildVariant(version.productType, domain.machineRole),
    buildCodeName(version.buildNumber, isServer),
  );
}
//#endregion
export {
  getWindowsDomainInfo,
  getWindowsOsRelease,
  getWindowsOsReleaseJson,
  getWindowsOsReleaseText,
  getWindowsProductEdition,
  getWindowsVersion,
  isAvailable,
  isWindowsDomainController,
  isWindowsDomainJoined,
  isWindowsServer,
  isWindowsWorkstation,
};
