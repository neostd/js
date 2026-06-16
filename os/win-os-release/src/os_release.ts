import type {
  DomainInfo,
  OsRelease,
  OsReleaseLike,
  OsVersionInfo,
  WinReleaseBackend,
} from "./types.ts";
import { MachineRole, ProductEdition, ProductType } from "./types.ts";

const globals = globalThis as typeof globalThis & {
  Bun?: unknown;
  Deno?: unknown;
  process?: {
    env?: Record<string, string | undefined>;
    platform?: string;
    getBuiltinModule?: (name: string) => unknown;
  };
};

let isSupported = false;

let backend: WinReleaseBackend = {
  getVersion(): OsVersionInfo {
    return {
      majorVersion: 0,
      minorVersion: 0,
      buildNumber: 0,
      platformId: 0,
      csdVersion: "",
      servicePackMajor: 0,
      servicePackMinor: 0,
      suiteMask: 0,
      productType: ProductType.WORKSTATION,
    };
  },
  getProductInfo(
    _majorVersion: number,
    _minorVersion: number,
    _spMajor: number,
    _spMinor: number,
  ): number {
    return 0;
  },
  getDomainInfo(): DomainInfo {
    return {
      machineRole: MachineRole.STANDALONE_WORKSTATION,
      flags: 0,
      domainNameFlat: "",
      domainNameDns: "",
      forestName: "",
    };
  },
};

if (globals.process?.platform === "win32" && globals.process.getBuiltinModule) {
  const { createRequire } = globals.process.getBuiltinModule(
    "node:module",
  ) as typeof import("node:module");
  const require = createRequire(import.meta.url);

  if (typeof globals.Deno !== "undefined") {
    backend = (require("./ffi_deno.ts") as typeof import("./ffi_deno.ts")).backend;
    isSupported = true;
  } else if (typeof globals.Bun !== "undefined") {
    backend = (require("./ffi_bun.ts") as typeof import("./ffi_bun.ts")).backend;
    isSupported = true;
  } else {
    try {
      if (globals.process.getBuiltinModule("node:ffi")) {
        backend = (require("./ffi_node.ts") as typeof import("./ffi_node.ts")).backend;
        isSupported = true;
      } else {
        backend = (require("./ffi_koffi.ts") as typeof import("./ffi_koffi.ts")).backend;
        isSupported = true;
      }
    } catch (error) {
      if (globals.process.env?.DEBUG === "true") {
        console.debug(error);
      }
    }
  }
}

function buildToDisplayVersion(build: number, isServer: boolean): string {
  if (isServer) {
    if (build >= 26100) return "Windows Server 2025";
    if (build >= 20348) return "Windows Server 2022";
    if (build >= 17763) return "Windows Server 2019";
    if (build >= 14393) return "Windows Server 2016";
    return "Windows Server";
  }

  if (build >= 22000) return "Windows 11";
  if (build >= 10240) return "Windows 10";
  return "Windows";
}

function getEditionSuffix(edition: number): string {
  switch (edition) {
    case ProductEdition.CORE:
    case ProductEdition.CORE_N:
    case ProductEdition.CORE_SINGLELANGUAGE:
      return "Home";
    case ProductEdition.PROFESSIONAL:
    case ProductEdition.PROFESSIONAL_N:
      return "Pro";
    case ProductEdition.PRO_WORKSTATION:
    case ProductEdition.PRO_WORKSTATION_N:
      return "Pro for Workstations";
    case ProductEdition.PRO_FOR_EDUCATION:
      return "Pro Education";
    case ProductEdition.EDUCATION:
    case ProductEdition.EDUCATION_N:
      return "Education";
    case ProductEdition.ENTERPRISE:
      return "Enterprise";
    case ProductEdition.ENTERPRISE_S:
    case ProductEdition.ENTERPRISE_S_N:
      return "Enterprise LTSC";
    case ProductEdition.STARTER:
      return "Starter";
    case ProductEdition.STANDARD_SERVER:
    case ProductEdition.STANDARD_SERVER_CORE:
    case ProductEdition.STANDARD_SERVER_AZURE:
      return "Standard";
    case ProductEdition.DATACENTER_SERVER:
    case ProductEdition.DATACENTER_SERVER_CORE:
    case ProductEdition.DATACENTER_SERVER_AZURE:
      return "Datacenter";
    case ProductEdition.ENTERPRISE_SERVER:
    case ProductEdition.ENTERPRISE_SERVER_CORE:
      return "Enterprise";
    case ProductEdition.WEB_SERVER:
      return "Web Server";
    case ProductEdition.ESSENTIALS_SERVER:
      return "Essentials";
    case ProductEdition.CLUSTER_SERVER:
      return "HPC Edition";
    case ProductEdition.IOTUAP:
    case ProductEdition.IOTENTERPRISE:
    case ProductEdition.IOTENTERPRISE_S:
      return "IoT Enterprise";
    case ProductEdition.HOME_BASIC:
    case ProductEdition.HOME_BASIC_N:
      return "Home Basic";
    case ProductEdition.HOME_PREMIUM:
      return "Home Premium";
    case ProductEdition.ULTIMATE:
      return "Ultimate";
    case ProductEdition.BUSINESS:
      return "Business";
    default:
      return "";
  }
}

function buildDisplayName(
  version: OsVersionInfo,
  productEdition: number,
  isServer: boolean,
): string {
  const base = buildToDisplayVersion(version.buildNumber, isServer);
  const suffix = getEditionSuffix(productEdition);
  return suffix ? `${base} ${suffix}` : base;
}

function buildVariant(productType: ProductType, machineRole: MachineRole): string {
  if (
    productType === ProductType.DOMAIN_CONTROLLER ||
    machineRole === MachineRole.PRIMARY_DC ||
    machineRole === MachineRole.BACKUP_DC
  ) {
    return "Domain Controller";
  }

  if (productType === ProductType.SERVER) {
    return "Server";
  }

  return "Workstation";
}

function buildCodeName(build: number, isServer: boolean): string {
  if (isServer) {
    if (build >= 26100) return "server2025";
    if (build >= 20348) return "server2022";
    if (build >= 17763) return "server2019";
    if (build >= 14393) return "server2016";
    return "server";
  }

  if (build >= 22000) return "win11";
  if (build >= 10240) return "win10";
  return "windows";
}

function formatOsRelease(displayName: string, variant: string, codeName: string): string {
  return [
    "ID=windows",
    'NAME="Windows"',
    `PRETTY_NAME="${displayName}"`,
    `VARIANT="${variant}"`,
    `VERSION_CODENAME="${codeName}"`,
  ].join("\n");
}

function buildOsReleaseLike(displayName: string, variant: string, codeName: string): OsReleaseLike {
  return { id: "windows", name: "Windows", prettyName: displayName, variant, codeName };
}

/**
 * Returns whether a Windows OS release backend is available in the current runtime.
 *
 * @returns `true` when Windows OS release detection is supported.
 */
export function isAvailable(): boolean {
  return isSupported;
}

/**
 * Reads the raw Windows version information.
 *
 * @returns The Windows version information structure.
 */
export function getWindowsVersion(): OsVersionInfo {
  return backend.getVersion();
}

/**
 * Resolves the Windows product edition for a version.
 *
 * @param version Optional version information.
 * @returns The Windows product edition code.
 */
export function getWindowsProductEdition(version?: OsVersionInfo): number {
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
export function getWindowsDomainInfo(): DomainInfo {
  return backend.getDomainInfo();
}

/**
 * Returns whether the OS is a Windows Server edition.
 *
 * @param verInfo Optional version information.
 * @returns `true` when the OS is a server edition.
 */
export function isWindowsServer(verInfo?: OsVersionInfo): boolean {
  const v = verInfo ?? backend.getVersion();
  return v.productType === ProductType.SERVER || v.productType === ProductType.DOMAIN_CONTROLLER;
}

/**
 * Returns whether the OS is a Windows domain controller.
 *
 * @param verInfo Optional version information.
 * @returns `true` when the OS is a domain controller.
 */
export function isWindowsDomainController(verInfo?: OsVersionInfo): boolean {
  const v = verInfo ?? backend.getVersion();
  return v.productType === ProductType.DOMAIN_CONTROLLER;
}

/**
 * Returns whether the OS is a Windows workstation edition.
 *
 * @param verInfo Optional version information.
 * @returns `true` when the OS is a workstation.
 */
export function isWindowsWorkstation(verInfo?: OsVersionInfo): boolean {
  const v = verInfo ?? backend.getVersion();
  return v.productType === ProductType.WORKSTATION;
}

/**
 * Returns whether the machine is domain joined.
 *
 * @param domainInfo Optional domain information.
 * @returns `true` when the machine is joined to a domain.
 */
export function isWindowsDomainJoined(domainInfo?: DomainInfo): boolean {
  const d = domainInfo ?? backend.getDomainInfo();
  return (
    d.machineRole === MachineRole.MEMBER_WORKSTATION ||
    d.machineRole === MachineRole.MEMBER_SERVER ||
    d.machineRole === MachineRole.PRIMARY_DC ||
    d.machineRole === MachineRole.BACKUP_DC
  );
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
export function getWindowsOsRelease(verInfo?: OsVersionInfo, domainInfo?: DomainInfo): OsRelease {
  const version = verInfo ?? backend.getVersion();
  const productEdition = backend.getProductInfo(
    version.majorVersion,
    version.minorVersion,
    version.servicePackMajor,
    version.servicePackMinor,
  );
  const domain = domainInfo ?? backend.getDomainInfo();
  const isServer =
    version.productType === ProductType.SERVER ||
    version.productType === ProductType.DOMAIN_CONTROLLER;
  const isDomainController =
    version.productType === ProductType.DOMAIN_CONTROLLER ||
    domain.machineRole === MachineRole.PRIMARY_DC ||
    domain.machineRole === MachineRole.BACKUP_DC;

  return {
    version,
    productEdition,
    domain,
    isServer,
    isDomainController,
    isWorkstation: version.productType === ProductType.WORKSTATION,
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
export function getWindowsOsReleaseText(verInfo?: OsVersionInfo, domainInfo?: DomainInfo): string {
  const version = verInfo ?? backend.getVersion();
  const productEdition = backend.getProductInfo(
    version.majorVersion,
    version.minorVersion,
    version.servicePackMajor,
    version.servicePackMinor,
  );
  const domain = domainInfo ?? backend.getDomainInfo();
  const isServer =
    version.productType === ProductType.SERVER ||
    version.productType === ProductType.DOMAIN_CONTROLLER;

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
export function getWindowsOsReleaseJson(
  verInfo?: OsVersionInfo,
  domainInfo?: DomainInfo,
): OsReleaseLike {
  const version = verInfo ?? backend.getVersion();
  const productEdition = backend.getProductInfo(
    version.majorVersion,
    version.minorVersion,
    version.servicePackMajor,
    version.servicePackMinor,
  );
  const domain = domainInfo ?? backend.getDomainInfo();
  const isServer =
    version.productType === ProductType.SERVER ||
    version.productType === ProductType.DOMAIN_CONTROLLER;

  return buildOsReleaseLike(
    buildDisplayName(version, productEdition, isServer),
    buildVariant(version.productType, domain.machineRole),
    buildCodeName(version.buildNumber, isServer),
  );
}
