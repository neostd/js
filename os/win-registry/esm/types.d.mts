//#region src/types.d.ts
/**
 * Shared types, constants, and backend interface for the Windows Registry module.
 *
 * @module
 */
declare const Rights: {
  readonly ALL_ACCESS: 983103;
  readonly CREATE_LINK: 32;
  readonly CREATE_SUB_KEY: 4;
  readonly ENUMERATE_SUB_KEYS: 8;
  readonly NOTIFY: 16;
  readonly QUERY_VALUE: 1;
  readonly READ: 131097;
  readonly SET_VALUE: 2;
  readonly WOW64_32KEY: 512;
  readonly WOW64_64KEY: 256;
  readonly WRITE: 131078;
};
/** Alias of `Rights.READ` for callers that prefer an execute-style name. */
declare const EXECUTE: 131097;
/** Windows Registry value types. */
declare const Types: {
  readonly NONE: 0;
  readonly SZ: 1;
  readonly EXPAND_SZ: 2;
  readonly BINARY: 3;
  readonly DWORD: 4;
  readonly DWORD_BIG_ENDIAN: 5;
  readonly LINK: 6;
  readonly MULTI_SZ: 7;
  readonly RESOURCE_LIST: 8;
  readonly FULL_RESOURCE_DESCRIPTOR: 9;
  readonly RESOURCE_REQUIREMENTS_LIST: 10;
  readonly QWORD: 11;
};
/** Summary information about a registry key. */
interface KeyInfo {
  subKeyCount: number;
  maxSubKeyLength: number;
  valueCount: number;
  maxValueNameLength: number;
  maxValueLength: number;
  lastWriteTime?: number;
}
/** Public registry key contract used by `Registry` and `RegistryKey`. */
interface Key {
  isNull(): boolean;
  unwrap(): unknown;
  readonly path: string;
  readonly created: boolean;
  close(): void;
  [Symbol.dispose](): void;
  openKey(path: string, access?: number): Key;
  createKey(path: string, access?: number): Key;
  deleteKey(name: string): boolean;
  deleteValue(name: string): boolean;
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
  setMultiString(name: string, value: string[]): void;
  setBinary(name: string, data: Uint8Array): void;
  setString(name: string, value: string): void;
  setExpandString(name: string, value: string): void;
  setInt32(name: string, value: number): void;
  setInt64(name: string, value: bigint): void;
  stat(): KeyInfo;
}
/** Predefined `HKEY_CLASSES_ROOT` handle. */
declare const HKEY_CLASSES_ROOT = 2147483648n;
/** Predefined `HKEY_CURRENT_USER` handle. */
declare const HKEY_CURRENT_USER = 2147483649n;
/** Predefined `HKEY_LOCAL_MACHINE` handle. */
declare const HKEY_LOCAL_MACHINE = 2147483650n;
/** Predefined `HKEY_USERS` handle. */
declare const HKEY_USERS = 2147483651n;
/** Predefined `HKEY_PERFORMANCE_DATA` handle. */
declare const HKEY_PERFORMANCE_DATA = 2147483652n;
/** Predefined `HKEY_CURRENT_CONFIG` handle. */
declare const HKEY_CURRENT_CONFIG = 2147483653n;
declare const ERROR_SUCCESS = 0;
declare const ERROR_FILE_NOT_FOUND = 2;
declare const ERROR_MORE_DATA = 234;
declare const ERROR_NO_MORE_ITEMS = 259;
/**
 * Encodes a string as a null-terminated UTF-16LE buffer.
 *
 * @param str String to encode.
 * @returns A UTF-16LE buffer with a trailing null terminator.
 */
declare function stringToWide(str: string): Uint8Array;
/**
 * Decodes a UTF-16LE registry string buffer.
 *
 * @param buffer The UTF-16LE buffer.
 * @param byteLength Optional byte length to decode.
 * @returns The decoded string up to the first null terminator.
 */
declare function wideToString(buffer: Uint8Array, byteLength?: number): string;
/**
 * Decodes a UTF-16LE `REG_MULTI_SZ` buffer.
 *
 * @param buffer The UTF-16LE buffer.
 * @param byteLength Optional byte length to decode.
 * @returns The decoded string list.
 */
declare function wideToMultiString(buffer: Uint8Array, byteLength?: number): string[];
/**
 * Encodes an array of strings as a null-terminated UTF-16LE `REG_MULTI_SZ`
 * buffer.
 *
 * @param arr Strings to encode.
 * @returns The encoded multi-string buffer.
 */
declare function multiStringToWide(arr: string[]): Uint8Array;
/**
 * Parses a registry path into a predefined root handle and subkey path.
 *
 * @example Usage
 * ```ts
 * import { parseRegistryPath } from "@neostd/win-registry/types";
 *
 * const parsed = parseRegistryPath("HKCU\\Software\\MyApp");
 * ```
 *
 * @param path Registry path beginning with a known root such as `HKCU` or `HKEY_LOCAL_MACHINE`.
 * @returns The parsed root handle and subkey.
 * @throws Error If the registry root is unknown.
 */
declare function parseRegistryPath(path: string): {
  hkey: bigint;
  subKey: string;
};
/** Internal backend contract implemented by runtime-specific FFI layers. */
interface RegistryBackend {
  openKey(hkey: bigint, subKey: string, access: number): bigint;
  createKey(
    hkey: bigint,
    subKey: string,
    access: number,
  ): {
    handle: bigint;
    created: boolean;
  };
  closeKey(hkey: bigint): void;
  deleteKey(hkey: bigint, subKey: string): number;
  deleteValue(hkey: bigint, valueName: string): number;
  queryInfoKey(hkey: bigint): {
    subKeyCount: number;
    maxSubKeyLength: number;
    valueCount: number;
    maxValueNameLength: number;
    maxValueLength: number;
    lastWriteTime: number;
  };
  enumKeyNames(hkey: bigint, index: number, nameBufferSize: number): string | null;
  enumValueNames(hkey: bigint, index: number, nameBufferSize: number): string | null;
  queryValue(
    hkey: bigint,
    valueName: string,
    buffer: Uint8Array,
  ): {
    type: number;
    bytesRead: number;
  } | null;
  setValue(hkey: bigint, valueName: string, type: number, data: Uint8Array): void;
}
//#endregion
export {
  ERROR_FILE_NOT_FOUND,
  ERROR_MORE_DATA,
  ERROR_NO_MORE_ITEMS,
  ERROR_SUCCESS,
  EXECUTE,
  HKEY_CLASSES_ROOT,
  HKEY_CURRENT_CONFIG,
  HKEY_CURRENT_USER,
  HKEY_LOCAL_MACHINE,
  HKEY_PERFORMANCE_DATA,
  HKEY_USERS,
  Key,
  KeyInfo,
  RegistryBackend,
  Rights,
  Types,
  multiStringToWide,
  parseRegistryPath,
  stringToWide,
  wideToMultiString,
  wideToString,
};
