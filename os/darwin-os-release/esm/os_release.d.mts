import { OsRelease } from "./types.mjs";

//#region src/os_release.d.ts
/** Returns whether macOS release detection is available in the current runtime. */
declare function isDarwinOsReleaseAvailable(): boolean;
/** Returns the generated `os-release` text for macOS. */
declare function getMacOsReleaseText(): string;
/** Returns the parsed macOS release information. */
declare function getMacOsRelease(): OsRelease;
/** Returns the macOS product name. */
declare function getProductName(): string;
/** Returns the macOS product version. */
declare function getProductVersion(): string;
/** Returns the macOS build version. */
declare function getBuildVersion(): string;
/** Returns the derived macOS codename. */
declare function getVersionCodename(): string;
//#endregion
export {
  getBuildVersion,
  getMacOsRelease,
  getMacOsReleaseText,
  getProductName,
  getProductVersion,
  getVersionCodename,
  isDarwinOsReleaseAvailable,
};
