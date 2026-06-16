//#region src/vault.d.ts
/**
 * Returns whether a macOS keychain backend is available in the current runtime.
 *
 * @returns `true` when generic password operations are supported.
 */
declare function isDarwinKeychainAvailable(): boolean;
/**
 * Reads and decodes a stored secret.
 *
 * @param service Keychain service name.
 * @param account Keychain account name.
 * @returns The stored secret string, or `null` when missing.
 */
declare function readSecret(service: string, account: string): string | null;
/**
 * Reads a stored secret as raw bytes.
 *
 * @param service Keychain service name.
 * @param account Keychain account name.
 * @returns The stored secret bytes, or `null` when missing.
 */
declare function getSecretBytes(service: string, account: string): Uint8Array | null;
/**
 * Stores or updates a generic password record.
 *
 * @param service Keychain service name.
 * @param account Keychain account name.
 * @param secret Secret string or bytes.
 */
declare function saveSecret(service: string, account: string, secret: string | Uint8Array): void;
/**
 * Deletes a generic password record.
 *
 * @param service Keychain service name.
 * @param account Keychain account name.
 * @returns `true` when a record was deleted.
 */
declare function removeSecret(service: string, account: string): boolean;
/**
 * Lists records for a service when the backend supports enumeration.
 *
 * @param service Keychain service name.
 * @returns Decoded records for the given service.
 */
declare function listSecrets(service: string): Array<{
  service: string;
  account: string;
  secret: string;
}>;
//#endregion
export {
  getSecretBytes,
  isDarwinKeychainAvailable,
  listSecrets,
  readSecret,
  removeSecret,
  saveSecret,
};
