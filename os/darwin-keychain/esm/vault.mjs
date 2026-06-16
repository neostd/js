//#region src/vault.ts
const globals = globalThis;
const decoder = new TextDecoder();
const encoder = new TextEncoder();
let isSupported = false;
let driver = {
  getSecretBytes(_service, _account) {
    return null;
  },
  setSecretBytes(_service, _account, _secret) {},
  deleteSecret(_service, _account) {
    return false;
  },
};
if (globals.process?.platform === "darwin" && globals.process.getBuiltinModule) {
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
/**
 * Returns whether a macOS keychain backend is available in the current runtime.
 *
 * @returns `true` when generic password operations are supported.
 */
function isDarwinKeychainAvailable() {
  return isSupported;
}
/**
 * Reads and decodes a stored secret.
 *
 * @param service Keychain service name.
 * @param account Keychain account name.
 * @returns The stored secret string, or `null` when missing.
 */
function readSecret(service, account) {
  const bytes = driver.getSecretBytes(service, account);
  return bytes === null ? null : decoder.decode(bytes);
}
/**
 * Reads a stored secret as raw bytes.
 *
 * @param service Keychain service name.
 * @param account Keychain account name.
 * @returns The stored secret bytes, or `null` when missing.
 */
function getSecretBytes(service, account) {
  return driver.getSecretBytes(service, account);
}
/**
 * Stores or updates a generic password record.
 *
 * @param service Keychain service name.
 * @param account Keychain account name.
 * @param secret Secret string or bytes.
 */
function saveSecret(service, account, secret) {
  driver.setSecretBytes(
    service,
    account,
    typeof secret === "string" ? encoder.encode(secret) : secret,
  );
}
/**
 * Deletes a generic password record.
 *
 * @param service Keychain service name.
 * @param account Keychain account name.
 * @returns `true` when a record was deleted.
 */
function removeSecret(service, account) {
  return driver.deleteSecret(service, account);
}
/**
 * Lists records for a service when the backend supports enumeration.
 *
 * Bun currently does not support keychain listing here because the FFI-based
 * implementation panics while enumerating Security.framework results.
 *
 * @param service Keychain service name.
 * @returns Decoded records for the given service.
 */
function listSecrets(service) {
  if (driver.list === void 0)
    throw new Error("darwin-keychain list is not supported in Bun right now because it triggers a Bun panic; other unsupported runtimes also omit list support");
  return driver.list(service).map((record) => ({
    service: record.service,
    account: record.account,
    secret: decoder.decode(record.secret),
  }));
}
//#endregion
export {
  getSecretBytes,
  isDarwinKeychainAvailable,
  listSecrets,
  readSecret,
  removeSecret,
  saveSecret,
};
