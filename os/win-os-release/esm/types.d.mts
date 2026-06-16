//#region src/types.d.ts
/**
 * Shared types for Windows OS release detection.
 *
 * @module
 */
declare enum ProductType {
  WORKSTATION = 1,
  DOMAIN_CONTROLLER = 2,
  SERVER = 3,
}
/** Windows machine role values. */
declare enum MachineRole {
  STANDALONE_WORKSTATION = 0,
  MEMBER_WORKSTATION = 1,
  STANDALONE_SERVER = 2,
  MEMBER_SERVER = 3,
  BACKUP_DC = 4,
  PRIMARY_DC = 5,
}
/** Windows suite mask flags. */
declare enum SuiteMask {
  SMALLBUSINESS = 1,
  ENTERPRISE = 2,
  BACKOFFICE = 4,
  TERMINAL = 16,
  SMALLBUSINESS_RESTRICTED = 32,
  EMBEDDEDNT = 64,
  DATACENTER = 128,
  SINGLEUSERTS = 256,
  PERSONAL = 512,
  BLADE = 1024,
  STORAGE_SERVER = 8192,
  COMPUTE_SERVER = 16384,
  WH_SERVER = 32768,
  MULTIUSERTS = 131072,
}
/** Windows product edition values returned by `GetProductInfo`. */
declare enum ProductEdition {
  UNDEFINED = 0,
  ULTIMATE = 1,
  HOME_BASIC = 2,
  HOME_PREMIUM = 3,
  ENTERPRISE = 4,
  HOME_BASIC_N = 5,
  BUSINESS = 6,
  STANDARD_SERVER = 7,
  DATACENTER_SERVER = 8,
  SMALLBUSINESS_SERVER = 9,
  ENTERPRISE_SERVER = 10,
  STARTER = 11,
  DATACENTER_SERVER_CORE = 12,
  STANDARD_SERVER_CORE = 13,
  ENTERPRISE_SERVER_CORE = 14,
  WEB_SERVER = 17,
  CLUSTER_SERVER = 18,
  HOME_SERVER = 19,
  STORAGE_EXPRESS_SERVER = 20,
  STORAGE_STANDARD_SERVER = 21,
  STORAGE_WORKGROUP_SERVER = 22,
  STORAGE_ENTERPRISE_SERVER = 23,
  SERVER_FOR_SMALLBUSINESS = 24,
  PROFESSIONAL = 48,
  PROFESSIONAL_N = 49,
  SOLUTION_SERVER = 50,
  ESSENTIALS_SERVER = 59,
  CORE = 101,
  CORE_N = 98,
  CORE_SINGLELANGUAGE = 100,
  PROFESSIONAL_WMC = 103,
  EDUCATION = 121,
  EDUCATION_N = 122,
  ENTERPRISE_S = 125,
  ENTERPRISE_S_N = 126,
  PRO_WORKSTATION = 161,
  PRO_WORKSTATION_N = 162,
  PRO_FOR_EDUCATION = 164,
  DATACENTER_SERVER_AZURE = 167,
  STANDARD_SERVER_AZURE = 168,
  IOTUAP = 123,
  IOTENTERPRISE = 188,
  IOTENTERPRISE_S = 191,
}
/** Raw Windows version information. */
interface OsVersionInfo {
  majorVersion: number;
  minorVersion: number;
  buildNumber: number;
  platformId: number;
  csdVersion: string;
  servicePackMajor: number;
  servicePackMinor: number;
  suiteMask: number;
  productType: ProductType;
}
/** Windows domain and machine role information. */
interface DomainInfo {
  machineRole: MachineRole;
  flags: number;
  domainNameFlat: string;
  domainNameDns: string;
  forestName: string;
}
/** High-level Windows OS release summary. */
interface OsRelease {
  version: OsVersionInfo;
  productEdition: number;
  domain: DomainInfo;
  isServer: boolean;
  isDomainController: boolean;
  isWorkstation: boolean;
  displayName: string;
}
/** JSON-friendly `os-release`-style view of Windows release information. */
interface OsReleaseLike extends Record<string, string | undefined> {
  id: string;
  name: string;
  prettyName: string;
  variant: string;
  codeName: string;
}
/** Internal backend contract implemented by runtime-specific FFI layers. */
interface WinReleaseBackend {
  getVersion(): OsVersionInfo;
  getProductInfo(
    majorVersion: number,
    minorVersion: number,
    spMajor: number,
    spMinor: number,
  ): number;
  getDomainInfo(): DomainInfo;
}
//#endregion
export {
  DomainInfo,
  MachineRole,
  OsRelease,
  OsReleaseLike,
  OsVersionInfo,
  ProductEdition,
  ProductType,
  SuiteMask,
  WinReleaseBackend,
};
