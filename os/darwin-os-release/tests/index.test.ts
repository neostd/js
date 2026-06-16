import { strictEqual } from "node:assert/strict";
import process from "node:process";
import { test } from "node:test";
import {
  getBuildVersion,
  getMacOsRelease,
  getMacOsReleaseText,
  getProductName,
  getProductVersion,
  isDarwinOsReleaseAvailable,
} from "../src/index.ts";

const DARWIN = process.platform === "darwin";

test("darwin-os-release::availability reports a boolean", () => {
  strictEqual(isDarwinOsReleaseAvailable(), DARWIN);
});

test("darwin-os-release::throws on non-macos", { skip: DARWIN }, () => {
  let threw = false;
  try {
    getProductName();
  } catch {
    threw = true;
  }
  strictEqual(threw, true);
});

test("darwin-os-release::reads version fields", { skip: !DARWIN }, () => {
  strictEqual(getProductName().length > 0, true);
  strictEqual(getProductVersion().length > 0, true);
  strictEqual(getBuildVersion().length > 0, true);
});

test("darwin-os-release::getOsReleaseJson has expected fields", { skip: !DARWIN }, () => {
  const json = getMacOsRelease();
  strictEqual(json.id, "macos");
  strictEqual(json.name.length > 0, true);
  strictEqual(json.version.length > 0, true);
  strictEqual(json.buildId.length > 0, true);
});

test("darwin-os-release::os-release text format", { skip: !DARWIN }, () => {
  const text = getMacOsReleaseText();
  strictEqual(text.includes("ID=macos"), true);
  strictEqual(text.includes("NAME="), true);
  strictEqual(text.includes("VERSION_ID="), true);
  strictEqual(text.includes("BUILD_ID="), true);
});
