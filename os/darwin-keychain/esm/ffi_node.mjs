import process from "node:process";
//#region src/ffi_node.ts
const { createRequire } = process.getBuiltinModule("node:module");
const ffi = createRequire(import.meta.url ?? "file:///")("node:ffi");
const sec = ffi.dlopen("/System/Library/Frameworks/Security.framework/Security", {
  SecKeychainFindGenericPassword: {
    parameters: ["pointer", "u32", "pointer", "u32", "pointer", "pointer", "pointer", "pointer"],
    result: "i32",
  },
  SecKeychainAddGenericPassword: {
    parameters: ["pointer", "u32", "pointer", "u32", "pointer", "u32", "pointer", "pointer"],
    result: "i32",
  },
  SecKeychainItemModifyAttributesAndData: {
    parameters: ["pointer", "pointer", "u32", "pointer"],
    result: "i32",
  },
  SecKeychainItemDelete: {
    parameters: ["pointer"],
    result: "i32",
  },
  SecKeychainItemFreeContent: {
    parameters: ["pointer", "pointer"],
    result: "i32",
  },
  SecKeychainSearchCreateFromAttributes: {
    parameters: ["pointer", "i32", "pointer", "pointer"],
    result: "i32",
  },
  SecKeychainSearchCopyNext: {
    parameters: ["pointer", "pointer"],
    result: "i32",
  },
  SecKeychainSearchRelease: {
    parameters: ["pointer"],
    result: "i32",
  },
  SecKeychainItemCopyAttributesAndData: {
    parameters: ["pointer", "pointer", "pointer", "pointer", "pointer", "pointer"],
    result: "i32",
  },
  SecKeychainItemFreeAttributesAndData: {
    parameters: ["pointer", "pointer"],
    result: "i32",
  },
});
const cf = ffi.dlopen("/System/Library/Frameworks/CoreFoundation.framework/CoreFoundation", {
  CFRelease: {
    parameters: ["pointer"],
    result: "void",
  },
});
const ERR_ITEM_NOT_FOUND = -25300;
const ITEM_CLASS_GENERIC_PASSWORD = 1734700656;
const ATTR_SERVICE = 1937138533;
const ATTR_ACCOUNT = 1633903476;
const enc = new TextEncoder();
function cbytes(value) {
  return enc.encode(value);
}
function osCheck(status, message) {
  if (status !== 0) throw new Error(`${message} (${status})`);
}
function readPtr(buf) {
  return new DataView(buf.buffer).getBigUint64(0, true);
}
function ptrToBytes(ptr, length) {
  return new Uint8Array(ffi.toArrayBuffer(ptr, length));
}
function readU32(ptr, offset) {
  return ffi.getUint32(ptr, offset);
}
function readU64(ptr, offset) {
  return ffi.getUint64(ptr, offset);
}
function makeServiceAttrList(service) {
  const serviceBytes = cbytes(service);
  const attrs = new Uint8Array(16);
  const av = new DataView(attrs.buffer);
  av.setUint32(0, ATTR_SERVICE, true);
  av.setUint32(4, serviceBytes.length, true);
  av.setBigUint64(8, ffi.getRawPointer(serviceBytes), true);
  const list = new Uint8Array(16);
  const lv = new DataView(list.buffer);
  lv.setUint32(0, 1, true);
  lv.setBigUint64(8, ffi.getRawPointer(attrs), true);
  return {
    attrs,
    list,
    refs: [serviceBytes],
  };
}
function findRecord(service, account) {
  const serviceBytes = cbytes(service);
  const accountBytes = cbytes(account);
  const pwLenBuf = new Uint8Array(4);
  const pwDataBuf = new Uint8Array(8);
  const itemRefBuf = new Uint8Array(8);
  const status = sec.functions.SecKeychainFindGenericPassword(
    null,
    serviceBytes.length,
    serviceBytes,
    accountBytes.length,
    accountBytes,
    pwLenBuf,
    pwDataBuf,
    itemRefBuf,
  );
  if (status === ERR_ITEM_NOT_FOUND) return null;
  osCheck(status, "SecKeychainFindGenericPassword failed");
  return {
    dataPtr: readPtr(pwDataBuf),
    itemPtr: readPtr(itemRefBuf),
    passwordLength: new DataView(pwLenBuf.buffer).getUint32(0, true),
  };
}
function getAccountAttribute(itemPtr) {
  const tag = new Uint8Array(4);
  const format = new Uint8Array(4);
  new DataView(tag.buffer).setUint32(0, ATTR_ACCOUNT, true);
  const info = new Uint8Array(24);
  const iv = new DataView(info.buffer);
  iv.setUint32(0, 1, true);
  iv.setBigUint64(8, ffi.getRawPointer(tag), true);
  iv.setBigUint64(16, ffi.getRawPointer(format), true);
  const outAttrs = new Uint8Array(8);
  const outLen = new Uint8Array(4);
  if (
    sec.functions.SecKeychainItemCopyAttributesAndData(
      itemPtr,
      info,
      null,
      outAttrs,
      outLen,
      null,
    ) !== 0
  )
    return "";
  const attrsPtr = readPtr(outAttrs);
  if (!attrsPtr) return "";
  try {
    if (readU32(attrsPtr, 0) === 0) return "";
    const attrsArrPtr = readU64(attrsPtr, 8);
    if (readU32(attrsArrPtr, 0) !== ATTR_ACCOUNT) return "";
    const len = readU32(attrsArrPtr, 4);
    const dataPtr = readU64(attrsArrPtr, 8);
    if (!dataPtr || len === 0) return "";
    return new TextDecoder().decode(ptrToBytes(dataPtr, len));
  } finally {
    sec.functions.SecKeychainItemFreeAttributesAndData(attrsPtr, null);
  }
}
function releaseFindResult(found) {
  if (!found) return;
  if (found.dataPtr) sec.functions.SecKeychainItemFreeContent(null, found.dataPtr);
  if (found.itemPtr) cf.functions.CFRelease(found.itemPtr);
}
const backend = {
  getSecretBytes(service, account) {
    const found = findRecord(service, account);
    if (!found) return null;
    try {
      return ptrToBytes(found.dataPtr, found.passwordLength);
    } finally {
      releaseFindResult(found);
    }
  },
  setSecretBytes(service, account, secret) {
    const found = findRecord(service, account);
    try {
      if (found && found.itemPtr) {
        osCheck(
          sec.functions.SecKeychainItemModifyAttributesAndData(
            found.itemPtr,
            null,
            secret.length,
            secret,
          ),
          "SecKeychainItemModifyAttributesAndData failed",
        );
        return;
      }
      const serviceBytes = cbytes(service);
      const accountBytes = cbytes(account);
      const itemOut = new Uint8Array(8);
      osCheck(
        sec.functions.SecKeychainAddGenericPassword(
          null,
          serviceBytes.length,
          serviceBytes,
          accountBytes.length,
          accountBytes,
          secret.length,
          secret,
          itemOut,
        ),
        "SecKeychainAddGenericPassword failed",
      );
      const item = readPtr(itemOut);
      if (item) cf.functions.CFRelease(item);
    } finally {
      releaseFindResult(found);
    }
  },
  deleteSecret(service, account) {
    const found = findRecord(service, account);
    if (!found) return false;
    try {
      osCheck(sec.functions.SecKeychainItemDelete(found.itemPtr), "SecKeychainItemDelete failed");
      return true;
    } finally {
      releaseFindResult(found);
    }
  },
  list(service) {
    const { list, refs: _refs } = makeServiceAttrList(service);
    const searchOut = new Uint8Array(8);
    const status = sec.functions.SecKeychainSearchCreateFromAttributes(
      null,
      ITEM_CLASS_GENERIC_PASSWORD,
      list,
      searchOut,
    );
    if (status === ERR_ITEM_NOT_FOUND) return [];
    osCheck(status, "SecKeychainSearchCreateFromAttributes failed");
    const searchPtr = readPtr(searchOut);
    if (!searchPtr) return [];
    const results = [];
    try {
      while (true) {
        const itemOut = new Uint8Array(8);
        if (sec.functions.SecKeychainSearchCopyNext(searchPtr, itemOut) !== 0) break;
        const itemPtr = readPtr(itemOut);
        if (!itemPtr) break;
        try {
          const account = getAccountAttribute(itemPtr);
          if (!account) continue;
          const secret = this.getSecretBytes(service, account);
          if (secret === null) continue;
          results.push({
            service,
            account,
            secret,
          });
        } finally {
          cf.functions.CFRelease(itemPtr);
        }
      }
    } finally {
      sec.functions.SecKeychainSearchRelease(searchPtr);
    }
    return results;
  },
};
//#endregion
export { backend };
