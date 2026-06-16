//#region src/os_release.ts
const globals = globalThis;
const DARWIN = process.platform === "darwin";
const dec = new TextDecoder();
const SYSTEM_VERSION_PLIST = "/System/Library/CoreServices/SystemVersion.plist";
const CODENAMES = {
  10.9: "mavericks",
  "10.10": "yosemite",
  10.11: "el capitan",
  10.12: "sierra",
  10.13: "high sierra",
  10.14: "mojave",
  10.15: "catalina",
  11: "big sur",
  12: "monterey",
  13: "ventura",
  14: "sonoma",
  15: "sequoia",
  24: "skyline",
  25: "tahoe",
  26: "chehalis",
};
let rawFields = null;
function readSystemVersionPlist() {
  let data;
  if (globals.Deno) data = globals.Deno.readFileSync(SYSTEM_VERSION_PLIST);
  else {
    const { readFileSync } = globals.process.getBuiltinModule("node:fs");
    data = readFileSync(SYSTEM_VERSION_PLIST);
  }
  return dec.decode(data);
}
function readPlistString(text, key) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`<key>${escapedKey}</key>\\s*<string>([^<]*)</string>`).exec(text)?.[1] ?? "";
}
function readSystemVersionFields() {
  const text = readSystemVersionPlist();
  return {
    ProductBuildVersion: readPlistString(text, "ProductBuildVersion"),
    ProductName: readPlistString(text, "ProductName"),
    ProductVersion: readPlistString(text, "ProductVersion"),
  };
}
function readMacOsInfo() {
  if (rawFields !== null) return rawFields;
  if (!DARWIN) throw new Error("darwin-os-release is only supported on macOS");
  rawFields = readSystemVersionFields();
  return rawFields;
}
function deriveCodename(version) {
  if (!version) return "";
  return CODENAMES[version] ?? CODENAMES[version.split(".")[0]] ?? "";
}
function capitalize(value) {
  return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;
}
/** Returns whether macOS release detection is available in the current runtime. */
function isDarwinOsReleaseAvailable() {
  return DARWIN;
}
/** Returns the generated `os-release` text for macOS. */
function getMacOsReleaseText() {
  const fields = readMacOsInfo();
  const codename = deriveCodename(fields.ProductVersion ?? "");
  return [
    "ID=macos",
    `NAME="${fields.ProductName ?? "macOS"}"`,
    `VERSION_ID="${fields.ProductVersion ?? ""}"`,
    `VERSION_CODENAME="${codename}"`,
    `BUILD_ID="${fields.BuildVersion ?? ""}"`,
  ].join("\n");
}
/** Returns the parsed macOS release information. */
function getMacOsRelease() {
  const fields = readMacOsInfo();
  const version = fields.ProductVersion ?? "";
  const codename = deriveCodename(version);
  const name = fields.ProductName ?? "macOS";
  return {
    id: "macos",
    name,
    prettyName: codename
      ? `${name} ${version.split(".")[0]} ${capitalize(codename)}`
      : `${name} ${version}`,
    version,
    versionId: version,
    versionCodename: codename,
    buildId: fields.BuildVersion ?? "",
    variant: "Desktop",
  };
}
/** Returns the macOS product name. */
function getProductName() {
  return readMacOsInfo().ProductName ?? "macOS";
}
/** Returns the macOS product version. */
function getProductVersion() {
  return readMacOsInfo().ProductVersion ?? "";
}
/** Returns the macOS build version. */
function getBuildVersion() {
  return readMacOsInfo().BuildVersion ?? "";
}
/** Returns the derived macOS codename. */
function getVersionCodename() {
  return deriveCodename(readMacOsInfo().ProductVersion ?? "");
}
//#endregion
export {
  getBuildVersion,
  getMacOsRelease,
  getMacOsReleaseText,
  getProductName,
  getProductVersion,
  getVersionCodename,
  isDarwinOsReleaseAvailable,
};
