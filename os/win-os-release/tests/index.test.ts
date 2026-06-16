import { deepStrictEqual, strictEqual } from "node:assert/strict";
import process from "node:process";
import { test } from "node:test";
import {
  MachineRole,
  ProductType,
  getWindowsDomainInfo,
  getWindowsOsRelease,
  getWindowsOsReleaseJson,
  getWindowsOsReleaseText,
  getWindowsProductEdition,
  getWindowsVersion,
  isAvailable,
  isWindowsDomainController,
  isWindowsDomainJoined,
  isWindowsServer,
  isWindowsWorkstation,
} from "../src/index.ts";
import type { DomainInfo, OsVersionInfo } from "../src/types.ts";

const WINDOWS = process.platform === "win32";

const workstationVersion: OsVersionInfo = {
  majorVersion: 10,
  minorVersion: 0,
  buildNumber: 22621,
  platformId: 2,
  csdVersion: "",
  servicePackMajor: 0,
  servicePackMinor: 0,
  suiteMask: 0,
  productType: ProductType.WORKSTATION,
};

const memberWorkstation: DomainInfo = {
  machineRole: MachineRole.MEMBER_WORKSTATION,
  flags: 0,
  domainNameFlat: "NEOSTD",
  domainNameDns: "neostd.local",
  forestName: "neostd.local",
};

test("win-os-release::availability reports a boolean", () => {
  strictEqual(typeof isAvailable(), "boolean");
});

test("win-os-release::helpers classify workstation and domain roles", () => {
  strictEqual(isWindowsServer(workstationVersion), false);
  strictEqual(isWindowsDomainController(workstationVersion), false);
  strictEqual(isWindowsWorkstation(workstationVersion), true);
  strictEqual(isWindowsDomainJoined(memberWorkstation), true);
  strictEqual(
    isWindowsDomainJoined({
      ...memberWorkstation,
      machineRole: MachineRole.STANDALONE_WORKSTATION,
    }),
    false,
  );
});

test("win-os-release::release builders produce consistent objects and text",
  { skip: !WINDOWS },
  () => {
    if (!WINDOWS) return;
  const release = getWindowsOsRelease(workstationVersion, memberWorkstation);
  const json = getWindowsOsReleaseJson(workstationVersion, memberWorkstation);
  const text = getWindowsOsReleaseText(workstationVersion, memberWorkstation);

  strictEqual(release.isServer, false);
  strictEqual(release.isDomainController, false);
  strictEqual(release.isWorkstation, true);
  strictEqual(release.displayName.includes("Windows"), true);
  strictEqual(json.id, "windows");
  strictEqual(json.name, "Windows");
  strictEqual(typeof json.prettyName, "string");
  strictEqual(text.includes('NAME="Windows"'), true);
  strictEqual(text.includes("VERSION_CODENAME="), true);
});

test(
  "win-os-release::release helpers are callable on non-windows runtimes",
  { skip: WINDOWS },
  () => {
    strictEqual(typeof getWindowsVersion().buildNumber, "number");
    strictEqual(typeof getWindowsProductEdition(), "number");
    deepStrictEqual(getWindowsDomainInfo().domainNameDns, "");
  },
);

test("win-os-release::Windows runtime helpers return structured data", { skip: !WINDOWS }, () => {
  if (!WINDOWS) return;

  const version = getWindowsVersion();
  const domain = getWindowsDomainInfo();
  const release = getWindowsOsRelease();

  strictEqual(typeof version.buildNumber, "number");
  strictEqual(typeof getWindowsProductEdition(version), "number");
  strictEqual(typeof domain.machineRole, "number");
  strictEqual(typeof release.displayName, "string");
  strictEqual(release.displayName.length > 0, true);
  strictEqual(typeof getWindowsOsReleaseText(), "string");
  strictEqual(typeof getWindowsOsReleaseJson().prettyName, "string");
  strictEqual(isWindowsServer(version) || isWindowsWorkstation(version), true);
  strictEqual(
    isWindowsDomainJoined(domain) ||
      domain.machineRole === MachineRole.STANDALONE_WORKSTATION ||
      domain.machineRole === MachineRole.STANDALONE_SERVER,
    true,
  );
});
