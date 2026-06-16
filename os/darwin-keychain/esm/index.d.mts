import { SecretRecord } from "./types.mjs";
import {
  getSecretBytes,
  isDarwinKeychainAvailable,
  listSecrets,
  readSecret,
  removeSecret,
  saveSecret,
} from "./vault.mjs";
export {
  type SecretRecord,
  getSecretBytes,
  isDarwinKeychainAvailable,
  listSecrets,
  readSecret,
  removeSecret,
  saveSecret,
};
