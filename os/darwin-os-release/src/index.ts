/**
 * macOS OS release detection helpers.
 *
 * @example Usage
 * ```ts
 * import { getMacOsRelease, isDarwinOsReleaseAvailable } from "@neostd/darwin-os-release";
 *
 * if (isDarwinOsReleaseAvailable()) {
 *   console.log(getMacOsRelease().prettyName);
 * }
 * ```
 *
 * @module
 */

export {
  getBuildVersion,
  getMacOsRelease,
  getMacOsReleaseText,
  getProductName,
  getProductVersion,
  getVersionCodename,
  isDarwinOsReleaseAvailable,
} from "./os_release.ts";
export type { OsRelease } from "./types.ts";
