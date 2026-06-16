import type { OsRelease } from "./types.ts";

const globals = globalThis as typeof globalThis & {
  Deno?: {
    readFileSync(path: string): Uint8Array;
  };
  process?: {
    getBuiltinModule(name: string): unknown;
  };
};

const LINUX = process.platform === "linux";
const dec = new TextDecoder();

let rawText: string | null = null;

function readOsReleaseTextInternal(): string {
  if (rawText !== null) return rawText;

  let data: Uint8Array;
  if (globals.Deno) {
    try {
      data = globals.Deno.readFileSync("/etc/os-release");
    } catch {
      data = globals.Deno.readFileSync("/usr/lib/os-release");
    }
  } else {
    const { readFileSync } = globals.process.getBuiltinModule(
      "node:fs",
    ) as typeof import("node:fs");
    try {
      data = readFileSync("/etc/os-release");
    } catch {
      data = readFileSync("/usr/lib/os-release");
    }
  }

  rawText = dec.decode(data);
  return rawText;
}

function parseOsRelease(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx);
    let value = trimmed.slice(idx + 1);
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function ensureLinux(): Record<string, string> {
  if (!LINUX) {
    throw new Error("linux-os-release is only supported on Linux");
  }
  return parseOsRelease(readOsReleaseTextInternal());
}

/** Returns whether Linux release detection is available in the current runtime. */
export function isLinuxOsReleaseAvailable(): boolean {
  return LINUX;
}

/** Returns the raw `/etc/os-release` text. */
export function getLinuxOsReleaseText(): string {
  ensureLinux();
  return rawText!;
}

/** Returns the parsed Linux release information. */
export function getLinuxOsRelease(): OsRelease {
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
export function getId(): string {
  return ensureLinux().ID ?? "";
}

/** Returns the `ID_LIKE` value. */
export function getIdLike(): string {
  return ensureLinux().ID_LIKE ?? "";
}

/** Returns the distribution name. */
export function getName(): string {
  return ensureLinux().NAME ?? "";
}

/** Returns the pretty distribution name. */
export function getPrettyName(): string {
  return ensureLinux().PRETTY_NAME ?? "";
}

/** Returns the distribution version string. */
export function getVersion(): string {
  return ensureLinux().VERSION ?? "";
}

/** Returns the distribution version ID. */
export function getVersionId(): string {
  return ensureLinux().VERSION_ID ?? "";
}

/** Returns the distribution codename. */
export function getVersionCodename(): string {
  return ensureLinux().VERSION_CODENAME ?? "";
}

/** Returns the distribution variant. */
export function getVariant(): string {
  return ensureLinux().VARIANT ?? "";
}

/** Returns the distribution variant ID. */
export function getVariantId(): string {
  return ensureLinux().VARIANT_ID ?? "";
}

/** Returns `true` if the `ID_LIKE` field contains the given identifier. */
export function isLike(id: string): boolean {
  return (ensureLinux().ID_LIKE ?? "").split(/\s+/).includes(id);
}
