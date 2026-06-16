//#region src/os_release.ts
const globals = globalThis;
const LINUX = process.platform === "linux";
const dec = new TextDecoder();
let rawText = null;
function readOsReleaseText() {
  if (rawText !== null) return rawText;
  let data;
  if (globals.Deno)
    try {
      data = globals.Deno.readFileSync("/etc/os-release");
    } catch {
      data = globals.Deno.readFileSync("/usr/lib/os-release");
    }
  else {
    const { readFileSync } = globals.process.getBuiltinModule("node:fs");
    try {
      data = readFileSync("/etc/os-release");
    } catch {
      data = readFileSync("/usr/lib/os-release");
    }
  }
  rawText = dec.decode(data);
  return rawText;
}
function parseOsRelease(text) {
  const out = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx);
    let value = trimmed.slice(idx + 1);
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    out[key] = value;
  }
  return out;
}
function ensureLinux() {
  if (!LINUX) throw new Error("linux-os-release is only supported on Linux");
  return parseOsRelease(readOsReleaseText());
}
/**
 * Returns whether Linux release detection is available in the current runtime.
 *
 * @returns `true` when the current runtime is Linux.
 */
function isAvailable() {
  return LINUX;
}
/**
 * Static class providing Linux OS release detection.
 */
var LinuxOsRelease = class {
  /** Returns the raw `/etc/os-release` text. */
  static getOsReleaseText() {
    ensureLinux();
    return rawText;
  }
  /** Returns the parsed Linux release information. */
  static getOsReleaseJson() {
    const fields = ensureLinux();
    return {
      id: fields.ID ?? "",
      idLike: fields.ID_LIKE ?? "",
      name: fields.NAME ?? "",
      prettyName: fields.PRETTY_NAME ?? "",
      version: fields.VERSION ?? "",
      versionId: fields.VERSION_ID ?? "",
      versionCodename: fields.VERSION_CODENAME ?? "",
      variant: fields.VARIANT ?? "",
      variantId: fields.VARIANT_ID ?? "",
      buildId: fields.BUILD_ID ?? "",
      homeUrl: fields.HOME_URL ?? "",
      supportUrl: fields.SUPPORT_URL ?? "",
      bugReportUrl: fields.BUG_REPORT_URL ?? "",
      privacyPolicyUrl: fields.PRIVACY_POLICY_URL ?? "",
      logo: fields.LOGO ?? "",
      cpeName: fields.CPE_NAME ?? "",
    };
  }
  /** Returns the distribution ID. */
  static getId() {
    return ensureLinux().ID ?? "";
  }
  /** Returns the `ID_LIKE` value. */
  static getIdLike() {
    return ensureLinux().ID_LIKE ?? "";
  }
  /** Returns the distribution name. */
  static getName() {
    return ensureLinux().NAME ?? "";
  }
  /** Returns the pretty distribution name. */
  static getPrettyName() {
    return ensureLinux().PRETTY_NAME ?? "";
  }
  /** Returns the distribution version string. */
  static getVersion() {
    return ensureLinux().VERSION ?? "";
  }
  /** Returns the distribution version ID. */
  static getVersionId() {
    return ensureLinux().VERSION_ID ?? "";
  }
  /** Returns the distribution codename. */
  static getVersionCodename() {
    return ensureLinux().VERSION_CODENAME ?? "";
  }
  /** Returns the distribution variant. */
  static getVariant() {
    return ensureLinux().VARIANT ?? "";
  }
  /** Returns the distribution variant ID. */
  static getVariantId() {
    return ensureLinux().VARIANT_ID ?? "";
  }
  /**
   * Returns `true` if the `ID_LIKE` field contains the given identifier.
   *
   * @param id Distribution family identifier to match.
   * @returns `true` when `ID_LIKE` contains the given value.
   */
  static isLike(id) {
    return (ensureLinux().ID_LIKE ?? "").split(/\s+/).includes(id);
  }
};
//#endregion
export { LinuxOsRelease, isAvailable };
