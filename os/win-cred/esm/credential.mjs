import "./types.mjs";
//#region src/credential.ts
const globals = globalThis;
let isSupported = false;
let driver = {
  write(_cred, _flags) {},
  read(_targetName, _type) {
    return null;
  },
  delete(_targetName, _type) {
    return false;
  },
  enumerate(_filter, _flags) {
    return [];
  },
};
if (globals.process?.platform === "win32" && globals.process.getBuiltinModule) {
  const { createRequire } = globals.process.getBuiltinModule("node:module");
  const require = createRequire(import.meta.url);
  if (typeof globals.Deno !== "undefined") {
    driver = require("./ffi_deno.ts").backend;
    isSupported = true;
  } else if (typeof globals.Bun !== "undefined") {
    driver = require("./ffi_bun.ts").backend;
    isSupported = true;
  } else
    try {
      if (globals.process.getBuiltinModule("node:ffi")) {
        driver = require("./ffi_node.ts").backend;
        isSupported = true;
      } else {
        driver = require("./ffi_koffi.ts").backend;
        isSupported = true;
      }
    } catch (error) {
      if (globals.process.env?.DEBUG === "true") console.debug(error);
    }
}
function rawToCredential(raw) {
  return {
    targetName: raw.targetName,
    type: raw.type,
    comment: raw.comment,
    credentialBlob: raw.credentialBlob,
    persist: raw.persist,
    targetAlias: raw.targetAlias,
    userName: raw.userName,
    lastWritten: raw.lastWritten,
    flags: raw.flags,
    attributeCount: raw.attributeCount,
  };
}
/**
 * Returns whether a Windows Credential Manager backend is available in the
 * current runtime.
 *
 * @returns `true` when credential operations are supported.
 */
function isAvailable() {
  return isSupported;
}
/**
 * Encodes a secret string as UTF-16LE bytes for Windows Credential Manager.
 *
 * @param secret Secret string to encode.
 * @returns The UTF-16LE encoded bytes.
 */
function encodeSecret(secret) {
  const buf = new Uint8Array(secret.length * 2);
  for (let i = 0; i < secret.length; i++) {
    const code = secret.charCodeAt(i);
    buf[i * 2] = code & 255;
    buf[i * 2 + 1] = (code >> 8) & 255;
  }
  return buf;
}
/**
 * Decodes a UTF-16LE credential blob into a string.
 *
 * @param blob Encoded credential bytes.
 * @returns The decoded secret string.
 */
function decodeSecret(blob) {
  return new TextDecoder("utf-16le").decode(blob);
}
/**
 * Saves or updates a credential in Windows Credential Manager.
 *
 * @example Usage
 * ```ts
 * import { saveCredential } from "@neostd/win-cred";
 *
 * saveCredential({ targetName: "myapp/token", secret: "secret" });
 * ```
 *
 * @param options Credential write options.
 */
function saveCredential(options) {
  const blob = typeof options.secret === "string" ? encodeSecret(options.secret) : options.secret;
  driver.write(
    {
      flags: 0,
      type: options.type ?? 1,
      targetName: options.targetName,
      comment: options.comment ?? "",
      lastWritten: 0n,
      credentialBlobSize: blob.length,
      credentialBlob: blob,
      persist: options.persist ?? 2,
      attributeCount: 0,
      targetAlias: "",
      userName: options.userName ?? "",
    },
    options.flags ?? 0,
  );
}
/**
 * Reads a credential from Windows Credential Manager.
 *
 * @param targetName Credential target name.
 * @param type Credential type.
 * @returns The credential when found, otherwise `null`.
 */
function readCredential(targetName, type = 1) {
  const raw = driver.read(targetName, type);
  return raw ? rawToCredential(raw) : null;
}
/**
 * Reads and decodes a credential secret as a string.
 *
 * @param targetName Credential target name.
 * @param type Credential type.
 * @returns The decoded secret string when found, otherwise `null`.
 */
function readSecret(targetName, type = 1) {
  const cred = readCredential(targetName, type);
  return cred ? decodeSecret(cred.credentialBlob) : null;
}
/**
 * Removes a credential from Windows Credential Manager.
 *
 * @param targetName Credential target name.
 * @param type Credential type.
 * @returns `true` when a credential was removed.
 */
function removeCredential(targetName, type = 1) {
  return driver.delete(targetName, type);
}
/**
 * Lists credentials available to the current user.
 *
 * @param filter Optional filter string.
 * @param flags Enumeration flags.
 * @returns The matching credentials.
 */
function listCredentials(filter, flags = 0) {
  return driver.enumerate(filter ?? null, flags).map(rawToCredential);
}
//#endregion
export {
  decodeSecret,
  encodeSecret,
  isAvailable,
  listCredentials,
  readCredential,
  readSecret,
  removeCredential,
  saveCredential,
};
