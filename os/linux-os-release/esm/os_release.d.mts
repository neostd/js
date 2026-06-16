import { OsRelease } from "./types.mjs";

//#region src/os_release.d.ts
/**
 * Returns whether Linux release detection is available in the current runtime.
 *
 * @returns `true` when the current runtime is Linux.
 */
declare function isAvailable(): boolean;
/**
 * Static class providing Linux OS release detection.
 */
declare class LinuxOsRelease {
  /** Returns the raw `/etc/os-release` text. */
  static getOsReleaseText(): string;
  /** Returns the parsed Linux release information. */
  static getOsReleaseJson(): OsRelease;
  /** Returns the distribution ID. */
  static getId(): string;
  /** Returns the `ID_LIKE` value. */
  static getIdLike(): string;
  /** Returns the distribution name. */
  static getName(): string;
  /** Returns the pretty distribution name. */
  static getPrettyName(): string;
  /** Returns the distribution version string. */
  static getVersion(): string;
  /** Returns the distribution version ID. */
  static getVersionId(): string;
  /** Returns the distribution codename. */
  static getVersionCodename(): string;
  /** Returns the distribution variant. */
  static getVariant(): string;
  /** Returns the distribution variant ID. */
  static getVariantId(): string;
  /**
   * Returns `true` if the `ID_LIKE` field contains the given identifier.
   *
   * @param id Distribution family identifier to match.
   * @returns `true` when `ID_LIKE` contains the given value.
   */
  static isLike(id: string): boolean;
}
//#endregion
export { LinuxOsRelease, isAvailable };
