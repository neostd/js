import { SecretRecord } from "./types.mjs";

//#region src/vault.d.ts
/**
 * Returns whether a libsecret backend is available in the current runtime.
 *
 * @returns `true` when libsecret operations are supported.
 */
declare function isLinuxLibsecretAvailable(): boolean;
/** Reads and decodes a stored secret. */
declare function readSecret(service: string, account: string): string | null;
/** Reads a stored secret as raw bytes. */
declare function getSecretBytes(service: string, account: string): Uint8Array | null;
/** Stores or updates a secret. */
declare function saveSecret(service: string, account: string, secret: string | Uint8Array): void;
/** Deletes a secret. */
declare function removeSecret(service: string, account: string): boolean;
/** Lists secrets for a service when the backend supports enumeration. */
declare function listSecrets(service: string): SecretRecord[];
//#endregion
export {
  getSecretBytes,
  isLinuxLibsecretAvailable,
  listSecrets,
  readSecret,
  removeSecret,
  saveSecret,
};
