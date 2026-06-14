import { Key, KeyInfo } from "./types.mjs";

//#region src/registry.d.ts
declare class RegistryError extends Error {
  constructor(message: string, options?: ErrorOptions);
  static throwUnsupported(): never;
}
/**
 * Returns whether a Windows Registry backend is available in the current
 * runtime.
 *
 * @returns `true` when registry operations are supported on the current runtime.
 */
declare function isRegistryAvailable(): boolean;
/**
 * Open registry key handle with convenience helpers for reading and writing
 * values.
 */
declare class RegistryKey implements Key {
  #private;
  constructor(handle: bigint, path: string, created?: boolean);
  get path(): string;
  get created(): boolean;
  isNull(): boolean;
  unwrap(): bigint;
  close(): void;
  [Symbol.dispose](): void;
  openKey(path: string, access?: number): Key;
  createKey(path: string, access?: number): Key;
  deleteKey(name: string): boolean;
  deleteValue(name: string): boolean;
  stat(): KeyInfo;
  getSubKeyNames(n?: number): string[];
  getValueNames(n?: number): string[];
  getValue(
    name: string,
    buffer?: Uint8Array,
  ): {
    data: Uint8Array;
    type: number;
  };
  getString(name: string): string;
  getMultiString(name: string): string[];
  getInt32(name: string): number;
  getInt64(name: string): bigint;
  getBinary(name: string): Uint8Array;
  setValue(name: string, data: Uint8Array, type: number): void;
  setString(name: string, value: string): void;
  setExpandString(name: string, value: string): void;
  setMultiString(name: string, value: string[]): void;
  setBinary(name: string, data: Uint8Array): void;
  setInt32(name: string, value: number): void;
  setInt64(name: string, value: bigint): void;
}
declare class Registry {
  /** Returns the predefined `HKEY_CLASSES_ROOT` key. */
  static get HKCR(): Key;
  /** Returns the predefined `HKEY_CURRENT_USER` key. */
  static get HKCU(): Key;
  /** Returns the predefined `HKEY_LOCAL_MACHINE` key. */
  static get HKLM(): Key;
  /** Returns the predefined `HKEY_USERS` key. */
  static get HKU(): Key;
  /** Returns the predefined `HKEY_PERFORMANCE_DATA` key. */
  static get HKPD(): Key;
  /** Returns the predefined `HKEY_CURRENT_CONFIG` key. */
  static get HKCC(): Key;
  /**
   * Opens an existing registry key.
   *
   * @param path Registry path to open.
   * @param access Requested access rights.
   * @returns The opened registry key.
   */
  static openKey(path: string, access?: number): Key;
  /**
   * Opens a child key relative to an existing key.
   *
   * @param key Parent key.
   * @param path Relative child path.
   * @param access Requested access rights.
   * @returns The opened registry key.
   */
  static openKey(key: Key, path: string, access?: number): Key;
  /**
   * Creates a registry key if needed and opens it.
   *
   * @param path Registry path to create.
   * @param access Requested access rights.
   * @returns The created or opened registry key.
   */
  static createKey(path: string, access?: number): Key;
  /**
   * Creates a child registry key relative to an existing key.
   *
   * @param key Parent key.
   * @param path Relative child path.
   * @param access Requested access rights.
   * @returns The created or opened registry key.
   */
  static createKey(key: Key, path: string, access?: number): Key;
  /**
   * Deletes a registry key.
   *
   * @param path Registry path to delete.
   */
  static deleteKey(path: string): void;
  /**
   * Deletes a child key relative to an existing key.
   *
   * @param key Parent key.
   * @param path Relative child path.
   */
  static deleteKey(key: Key, path: string): void;
}
//#endregion
export { Registry, RegistryError, RegistryKey, isRegistryAvailable };
