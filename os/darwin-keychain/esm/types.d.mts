//#region src/types.d.ts
/** Secret record returned by keychain listing operations. */
interface SecretRecord {
  service: string;
  account: string;
  secret: Uint8Array;
}
/** Internal backend contract implemented by runtime-specific keychain backends. */
interface DarwinKeychainBackend {
  getSecretBytes(service: string, account: string): Uint8Array | null;
  setSecretBytes(service: string, account: string, secret: Uint8Array): void;
  deleteSecret(service: string, account: string): boolean;
  list?: (service: string) => SecretRecord[];
}
//#endregion
export { DarwinKeychainBackend, SecretRecord };
