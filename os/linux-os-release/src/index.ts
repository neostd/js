/**
 * Linux OS release detection helpers.
 *
 * @example Usage
 * ```ts
 * import { getLinuxOsRelease, isLinuxOsReleaseAvailable } from "@neostd/linux-os-release";
 *
 * if (isLinuxOsReleaseAvailable()) {
 *   console.log(getLinuxOsRelease().prettyName);
 * }
 * ```
 *
 * @module
 */

export {
  getId,
  getIdLike,
  getLinuxOsRelease,
  getLinuxOsReleaseText,
  getName,
  getPrettyName,
  getVariant,
  getVariantId,
  getVersion,
  getVersionCodename,
  getVersionId,
  isLike,
  isLinuxOsReleaseAvailable,
} from "./os_release.ts";
export type { OsRelease } from "./types.ts";
