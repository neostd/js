/**
 * Windows OS release detection helpers.
 *
 * @example Usage
 * ```ts
 * import { getWindowsOsRelease, isAvailable } from "@neostd/win-os-release";
 *
 * if (isAvailable()) {
 *   console.log(getWindowsOsRelease().displayName);
 * }
 * ```
 *
 * @module
 */

export * from "./os_release.ts";
export {
  type DomainInfo,
  MachineRole,
  type OsRelease,
  type OsReleaseLike,
  type OsVersionInfo,
  ProductEdition,
  ProductType,
  SuiteMask,
  type WinReleaseBackend as OsReleaseBackend,
} from "./types.ts";
