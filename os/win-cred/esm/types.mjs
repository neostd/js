//#region src/types.ts
/**
 * Shared types, enums, constants and backend interface for the Windows Credential Management module.
 *
 * @module
 */
let CredType = /* @__PURE__ */ (function (CredType) {
  CredType[(CredType["GENERIC"] = 1)] = "GENERIC";
  CredType[(CredType["DOMAIN_PASSWORD"] = 2)] = "DOMAIN_PASSWORD";
  CredType[(CredType["DOMAIN_CERTIFICATE"] = 3)] = "DOMAIN_CERTIFICATE";
  CredType[(CredType["DOMAIN_VISIBLE_PASSWORD"] = 4)] = "DOMAIN_VISIBLE_PASSWORD";
  CredType[(CredType["GENERIC_CERTIFICATE"] = 5)] = "GENERIC_CERTIFICATE";
  CredType[(CredType["DOMAIN_EXTENDED"] = 6)] = "DOMAIN_EXTENDED";
  CredType[(CredType["MAXIMUM"] = 7)] = "MAXIMUM";
  CredType[(CredType["MAXIMUM_EX"] = 1007)] = "MAXIMUM_EX";
  return CredType;
})({});
/** Credential persistence options. */
let CredPersist = /* @__PURE__ */ (function (CredPersist) {
  CredPersist[(CredPersist["SESSION"] = 1)] = "SESSION";
  CredPersist[(CredPersist["LOCAL_MACHINE"] = 2)] = "LOCAL_MACHINE";
  CredPersist[(CredPersist["ENTERPRISE"] = 3)] = "ENTERPRISE";
  return CredPersist;
})({});
/** Flags accepted by credential write operations. */
let CredWriteFlags = /* @__PURE__ */ (function (CredWriteFlags) {
  CredWriteFlags[(CredWriteFlags["NONE"] = 0)] = "NONE";
  CredWriteFlags[(CredWriteFlags["PRESERVE_CREDENTIAL_BLOB"] = 1)] = "PRESERVE_CREDENTIAL_BLOB";
  return CredWriteFlags;
})({});
/** Flags accepted by credential enumeration operations. */
let CredEnumerateFlags = /* @__PURE__ */ (function (CredEnumerateFlags) {
  CredEnumerateFlags[(CredEnumerateFlags["NONE"] = 0)] = "NONE";
  CredEnumerateFlags[(CredEnumerateFlags["ALL_CREDENTIALS"] = 1)] = "ALL_CREDENTIALS";
  return CredEnumerateFlags;
})({});
/**
 * Encodes a string as a null-terminated UTF-16LE buffer.
 *
 * @param str String to encode.
 * @returns The encoded UTF-16LE buffer.
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
 * Decodes a UTF-16LE buffer up to the first null terminator.
 *
 * @param buffer Encoded UTF-16LE buffer.
 * @param byteLength Optional byte length to decode.
 * @returns The decoded string.
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
//#endregion
export { CredEnumerateFlags, CredPersist, CredType, CredWriteFlags, stringToWide, wideToString };
