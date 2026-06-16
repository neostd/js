import type { OsRelease } from "./types.ts";

const globals = globalThis as typeof globalThis & {
  Deno?: {
    readFileSync(path: string): Uint8Array;
  };
  process?: {
    getBuiltinModule(name: string): unknown;
  };
};

const DARWIN = process.platform === "darwin";
const dec = new TextDecoder();
const SYSTEM_VERSION_PLIST = "/System/Library/CoreServices/SystemVersion.plist";

const CODENAMES: Record<string, string> = {
  "10.9": "mavericks",
  "10.10": "yosemite",
  "10.11": "el capitan",
  "10.12": "sierra",
  "10.13": "high sierra",
  "10.14": "mojave",
  "10.15": "catalina",
  "11": "big sur",
  "12": "monterey",
  "13": "ventura",
  "14": "sonoma",
  "15": "sequoia",
  "24": "skyline",
  "25": "tahoe",
  "26": "chehalis",
};

let rawFields: Record<string, string> | null = null;

function readSystemVersionPlist(): string {
  let data: Uint8Array;

  if (globals.Deno) {
    data = globals.Deno.readFileSync(SYSTEM_VERSION_PLIST);
  } else {
    const { readFileSync } = globals.process.getBuiltinModule(
      "node:fs",
    ) as typeof import("node:fs");
    data = readFileSync(SYSTEM_VERSION_PLIST);
  }

  return dec.decode(data);
}

function readPlistString(text: string, key: string): string {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`<key>${escapedKey}</key>\\s*<string>([^<]*)</string>`).exec(text);
  return match?.[1] ?? "";
}

function readSystemVersionFields(): Record<string, string> {
  const text = readSystemVersionPlist();
  return {
    ProductBuildVersion: readPlistString(text, "ProductBuildVersion"),
    ProductName: readPlistString(text, "ProductName"),
    ProductVersion: readPlistString(text, "ProductVersion"),
  };
}

function readMacOsInfo(): Record<string, string> {
  if (rawFields !== null) return rawFields;
  if (!DARWIN) {
    throw new Error("darwin-os-release is only supported on macOS");
  }
  rawFields = readSystemVersionFields();
  return rawFields;
}

function deriveCodename(version: string): string {
  if (!version) return "";
  return CODENAMES[version] ?? CODENAMES[version.split(".")[0]] ?? "";
}

function capitalize(value: string): string {
  return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;
}

/** Returns whether macOS release detection is available in the current runtime. */
export function isDarwinOsReleaseAvailable(): boolean {
  return DARWIN;
}

/** Returns the generated `os-release` text for macOS. */
export function getMacOsReleaseText(): string {
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
export function getMacOsRelease(): OsRelease {
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
export function getProductName(): string {
  return readMacOsInfo().ProductName ?? "macOS";
}

/** Returns the macOS product version. */
export function getProductVersion(): string {
  return readMacOsInfo().ProductVersion ?? "";
}

/** Returns the macOS build version. */
export function getBuildVersion(): string {
  return readMacOsInfo().BuildVersion ?? "";
}

/** Returns the derived macOS codename. */
export function getVersionCodename(): string {
  return deriveCodename(readMacOsInfo().ProductVersion ?? "");
}
