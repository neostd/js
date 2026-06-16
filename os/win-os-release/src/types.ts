/**
 * Shared types for Windows OS release detection.
 *
 * @module
 */
export enum ProductType {
  WORKSTATION = 1,
  DOMAIN_CONTROLLER = 2,
  SERVER = 3,
}
/** Windows machine role values. */
export enum MachineRole {
  STANDALONE_WORKSTATION = 0,
  MEMBER_WORKSTATION = 1,
  STANDALONE_SERVER = 2,
  MEMBER_SERVER = 3,
  BACKUP_DC = 4,
  PRIMARY_DC = 5,
}
/** Windows suite mask flags. */
export enum SuiteMask {
  SMALLBUSINESS = 0x0001,
  ENTERPRISE = 0x0002,
  BACKOFFICE = 0x0004,
  TERMINAL = 0x0010,
  SMALLBUSINESS_RESTRICTED = 0x0020,
  EMBEDDEDNT = 0x0040,
  DATACENTER = 0x0080,
  SINGLEUSERTS = 0x0100,
  PERSONAL = 0x0200,
  BLADE = 0x0400,
  STORAGE_SERVER = 0x2000,
  COMPUTE_SERVER = 0x4000,
  WH_SERVER = 0x8000,
  MULTIUSERTS = 0x00020000,
}
/** Windows product edition values returned by `GetProductInfo`. */
export enum ProductEdition {
  UNDEFINED = 0x00000000,
  ULTIMATE = 0x00000001,
  HOME_BASIC = 0x00000002,
  HOME_PREMIUM = 0x00000003,
  ENTERPRISE = 0x00000004,
  HOME_BASIC_N = 0x00000005,
  BUSINESS = 0x00000006,
  STANDARD_SERVER = 0x00000007,
  DATACENTER_SERVER = 0x00000008,
  SMALLBUSINESS_SERVER = 0x00000009,
  ENTERPRISE_SERVER = 0x0000000a,
  STARTER = 0x0000000b,
  DATACENTER_SERVER_CORE = 0x0000000c,
  STANDARD_SERVER_CORE = 0x0000000d,
  ENTERPRISE_SERVER_CORE = 0x0000000e,
  WEB_SERVER = 0x00000011,
  CLUSTER_SERVER = 0x00000012,
  HOME_SERVER = 0x00000013,
  STORAGE_EXPRESS_SERVER = 0x00000014,
  STORAGE_STANDARD_SERVER = 0x00000015,
  STORAGE_WORKGROUP_SERVER = 0x00000016,
  STORAGE_ENTERPRISE_SERVER = 0x00000017,
  SERVER_FOR_SMALLBUSINESS = 0x00000018,
  PROFESSIONAL = 0x00000030,
  PROFESSIONAL_N = 0x00000031,
  SOLUTION_SERVER = 0x00000032,
  ESSENTIALS_SERVER = 0x0000003b,
  CORE = 0x00000065,
  CORE_N = 0x00000062,
  CORE_SINGLELANGUAGE = 0x00000064,
  PROFESSIONAL_WMC = 0x00000067,
  EDUCATION = 0x00000079,
  EDUCATION_N = 0x0000007a,
  ENTERPRISE_S = 0x0000007d,
  ENTERPRISE_S_N = 0x0000007e,
  PRO_WORKSTATION = 0x000000a1,
  PRO_WORKSTATION_N = 0x000000a2,
  PRO_FOR_EDUCATION = 0x000000a4,
  DATACENTER_SERVER_AZURE = 0x000000a7,
  STANDARD_SERVER_AZURE = 0x000000a8,
  IOTUAP = 0x0000007b,
  IOTENTERPRISE = 0x000000bc,
  IOTENTERPRISE_S = 0x000000bf,
}
/** Raw Windows version information. */
export interface OsVersionInfo {
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
export interface DomainInfo {
  machineRole: MachineRole;
  flags: number;
  domainNameFlat: string;
  domainNameDns: string;
  forestName: string;
}
/** High-level Windows OS release summary. */
export interface OsRelease {
  version: OsVersionInfo;
  productEdition: number;
  domain: DomainInfo;
  isServer: boolean;
  isDomainController: boolean;
  isWorkstation: boolean;
  displayName: string;
}
/** JSON-friendly `os-release`-style view of Windows release information. */
export interface OsReleaseLike extends Record<string, string | undefined> {
  id: string;
  name: string;
  prettyName: string;
  variant: string;
  codeName: string;
}
/** Internal backend contract implemented by runtime-specific FFI layers. */
export interface WinReleaseBackend {
  getVersion(): OsVersionInfo;
  getProductInfo(
    majorVersion: number,
    minorVersion: number,
    spMajor: number,
    spMinor: number,
  ): number;
  getDomainInfo(): DomainInfo;
}
