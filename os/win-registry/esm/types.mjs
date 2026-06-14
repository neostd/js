//#region src/types.ts
/**
 * Shared types, constants, and backend interface for the Windows Registry module.
 *
 * @module
 */
const Rights = {
  ALL_ACCESS: 983103,
  CREATE_LINK: 32,
  CREATE_SUB_KEY: 4,
  ENUMERATE_SUB_KEYS: 8,
  NOTIFY: 16,
  QUERY_VALUE: 1,
  READ: 131097,
  SET_VALUE: 2,
  WOW64_32KEY: 512,
  WOW64_64KEY: 256,
  WRITE: 131078,
};
/** Alias of `Rights.READ` for callers that prefer an execute-style name. */
const EXECUTE = Rights.READ;
/** Windows Registry value types. */
const Types = {
  NONE: 0,
  SZ: 1,
  EXPAND_SZ: 2,
  BINARY: 3,
  DWORD: 4,
  DWORD_BIG_ENDIAN: 5,
  LINK: 6,
  MULTI_SZ: 7,
  RESOURCE_LIST: 8,
  FULL_RESOURCE_DESCRIPTOR: 9,
  RESOURCE_REQUIREMENTS_LIST: 10,
  QWORD: 11,
};
/** Predefined `HKEY_CLASSES_ROOT` handle. */
const HKEY_CLASSES_ROOT = 2147483648n;
/** Predefined `HKEY_CURRENT_USER` handle. */
const HKEY_CURRENT_USER = 2147483649n;
/** Predefined `HKEY_LOCAL_MACHINE` handle. */
const HKEY_LOCAL_MACHINE = 2147483650n;
/** Predefined `HKEY_USERS` handle. */
const HKEY_USERS = 2147483651n;
/** Predefined `HKEY_PERFORMANCE_DATA` handle. */
const HKEY_PERFORMANCE_DATA = 2147483652n;
/** Predefined `HKEY_CURRENT_CONFIG` handle. */
const HKEY_CURRENT_CONFIG = 2147483653n;
const ERROR_SUCCESS = 0;
const ERROR_FILE_NOT_FOUND = 2;
const ERROR_MORE_DATA = 234;
const ERROR_NO_MORE_ITEMS = 259;
/**
 * Encodes a string as a null-terminated UTF-16LE buffer.
 *
 * @param str String to encode.
 * @returns A UTF-16LE buffer with a trailing null terminator.
 */
function stringToWide(str) {
  const buf = new Uint8Array((str.length + 1) * 2);
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    buf[i * 2] = code & 255;
    buf[i * 2 + 1] = (code >> 8) & 255;
  }
  return buf;
}
/**
 * Decodes a UTF-16LE registry string buffer.
 *
 * @param buffer The UTF-16LE buffer.
 * @param byteLength Optional byte length to decode.
 * @returns The decoded string up to the first null terminator.
 */
function wideToString(buffer, byteLength) {
  const len = byteLength ?? buffer.length;
  const decoder = new TextDecoder("utf-16le");
  let end = len;
  for (let i = 0; i < len - 1; i += 2)
    if (buffer[i] === 0 && buffer[i + 1] === 0) {
      end = i;
      break;
    }
  return decoder.decode(buffer.subarray(0, end));
}
/**
 * Decodes a UTF-16LE `REG_MULTI_SZ` buffer.
 *
 * @param buffer The UTF-16LE buffer.
 * @param byteLength Optional byte length to decode.
 * @returns The decoded string list.
 */
function wideToMultiString(buffer, byteLength) {
  const result = [];
  const decoder = new TextDecoder("utf-16le");
  const len = byteLength ?? buffer.length;
  let start = 0;
  for (let i = 0; i < len - 1; i += 2)
    if (buffer[i] === 0 && buffer[i + 1] === 0) {
      if (i === start) break;
      result.push(decoder.decode(buffer.subarray(start, i)));
      start = i + 2;
    }
  return result;
}
/**
 * Encodes an array of strings as a null-terminated UTF-16LE `REG_MULTI_SZ`
 * buffer.
 *
 * @param arr Strings to encode.
 * @returns The encoded multi-string buffer.
 */
function multiStringToWide(arr) {
  if (arr.length === 0) return new Uint8Array([0, 0, 0, 0]);
  let totalChars = 0;
  for (const s of arr) totalChars += s.length + 1;
  totalChars += 1;
  const buf = new Uint8Array(totalChars * 2);
  let offset = 0;
  for (const s of arr) {
    for (let i = 0; i < s.length; i++) {
      const code = s.charCodeAt(i);
      buf[offset] = code & 255;
      buf[offset + 1] = (code >> 8) & 255;
      offset += 2;
    }
    buf[offset] = 0;
    buf[offset + 1] = 0;
    offset += 2;
  }
  buf[offset] = 0;
  buf[offset + 1] = 0;
  return buf;
}
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
function parseRegistryPath(path) {
  const sep = path.indexOf("\\");
  const root = sep === -1 ? path : path.slice(0, sep);
  const subKey = sep === -1 ? "" : path.slice(sep + 1);
  switch (root.toUpperCase()) {
    case "HKEY_CLASSES_ROOT":
    case "HKCR":
      return {
        hkey: HKEY_CLASSES_ROOT,
        subKey,
      };
    case "HKEY_CURRENT_USER":
    case "HKCU":
      return {
        hkey: HKEY_CURRENT_USER,
        subKey,
      };
    case "HKEY_LOCAL_MACHINE":
    case "HKLM":
      return {
        hkey: HKEY_LOCAL_MACHINE,
        subKey,
      };
    case "HKEY_USERS":
    case "HKU":
      return {
        hkey: HKEY_USERS,
        subKey,
      };
    case "HKEY_PERFORMANCE_DATA":
    case "HKPD":
      return {
        hkey: HKEY_PERFORMANCE_DATA,
        subKey,
      };
    case "HKEY_CURRENT_CONFIG":
    case "HKCC":
      return {
        hkey: HKEY_CURRENT_CONFIG,
        subKey,
      };
    default:
      throw new Error(`Unknown registry root key: ${root}`);
  }
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
  Rights,
  Types,
  multiStringToWide,
  parseRegistryPath,
  stringToWide,
  wideToMultiString,
  wideToString,
};
