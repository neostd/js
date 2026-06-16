import { DomainInfo, OsRelease, OsReleaseLike, OsVersionInfo } from "./types.mjs";

//#region src/os_release.d.ts
/**
 * Returns whether a Windows OS release backend is available in the current runtime.
 *
 * @returns `true` when Windows OS release detection is supported.
 */
declare function isAvailable(): boolean;
/**
 * Reads the raw Windows version information.
 *
 * @returns The Windows version information structure.
 */
declare function getWindowsVersion(): OsVersionInfo;
/**
 * Resolves the Windows product edition for a version.
 *
 * @param version Optional version information.
 * @returns The Windows product edition code.
 */
declare function getWindowsProductEdition(version?: OsVersionInfo): number;
/**
 * Reads Windows domain and machine role information.
 *
 * @returns The domain information.
 */
declare function getWindowsDomainInfo(): DomainInfo;
/**
 * Returns whether the OS is a Windows Server edition.
 *
 * @param verInfo Optional version information.
 * @returns `true` when the OS is a server edition.
 */
declare function isWindowsServer(verInfo?: OsVersionInfo): boolean;
/**
 * Returns whether the OS is a Windows domain controller.
 *
 * @param verInfo Optional version information.
 * @returns `true` when the OS is a domain controller.
 */
declare function isWindowsDomainController(verInfo?: OsVersionInfo): boolean;
/**
 * Returns whether the OS is a Windows workstation edition.
 *
 * @param verInfo Optional version information.
 * @returns `true` when the OS is a workstation.
 */
declare function isWindowsWorkstation(verInfo?: OsVersionInfo): boolean;
/**
 * Returns whether the machine is domain joined.
 *
 * @param domainInfo Optional domain information.
 * @returns `true` when the machine is joined to a domain.
 */
declare function isWindowsDomainJoined(domainInfo?: DomainInfo): boolean;
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
declare function getWindowsOsRelease(verInfo?: OsVersionInfo, domainInfo?: DomainInfo): OsRelease;
/**
 * Builds Linux-style `os-release` text from Windows version data.
 *
 * @param verInfo Optional version information.
 * @param domainInfo Optional domain information.
 * @returns The generated `os-release` text.
 */
declare function getWindowsOsReleaseText(verInfo?: OsVersionInfo, domainInfo?: DomainInfo): string;
/**
 * Builds a JSON-friendly `os-release` view from Windows version data.
 *
 * @param verInfo Optional version information.
 * @param domainInfo Optional domain information.
 * @returns The generated `os-release` object.
 */
declare function getWindowsOsReleaseJson(
  verInfo?: OsVersionInfo,
  domainInfo?: DomainInfo,
): OsReleaseLike;
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
