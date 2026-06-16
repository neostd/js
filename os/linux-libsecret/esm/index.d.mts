import { SecretRecord } from "./types.mjs";
import {
  getSecretBytes,
  isLinuxLibsecretAvailable,
  listSecrets,
  readSecret,
  removeSecret,
  saveSecret,
} from "./vault.mjs";
export {
  type SecretRecord,
  getSecretBytes,
  isLinuxLibsecretAvailable,
  listSecrets,
  readSecret,
  removeSecret,
  saveSecret,
};
