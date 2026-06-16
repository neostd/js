import { strictEqual } from "node:assert/strict";
import process from "node:process";
import { test } from "node:test";
import {
  getId,
  getIdLike,
  getLinuxOsRelease,
  getLinuxOsReleaseText,
  isLike,
  isLinuxOsReleaseAvailable,
} from "../src/index.ts";

const LINUX = process.platform === "linux";

test("linux-os-release::availability reports a boolean", () => {
  strictEqual(isLinuxOsReleaseAvailable(), LINUX);
});

test("linux-os-release::throws on non-linux", { skip: LINUX }, () => {
  let threw = false;
  try {
    getId();
  } catch {
    threw = true;
  }
  strictEqual(threw, true);
});

test("linux-os-release::reads os-release fields", { skip: !LINUX }, () => {
  strictEqual(getLinuxOsReleaseText().length > 0, true);
  const json = getLinuxOsRelease();
  strictEqual(json.id.length > 0, true);
  strictEqual(json.name.length > 0, true);
});

test("linux-os-release::id-like parsing", { skip: !LINUX }, () => {
  strictEqual(typeof getIdLike(), "string");
  strictEqual(typeof isLike("debian"), "boolean");
});

test("linux-os-release::text and json match", { skip: !LINUX }, () => {
  const text = getLinuxOsReleaseText();
  const json = getLinuxOsRelease();

  for (const line of text.split("\n")) {
    const idx = line.indexOf("=");
    if (idx === -1) continue;

    const k = line.slice(0, idx);
    let v = line.slice(idx + 1);
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);

    if (k === "ID") strictEqual(json.id, v);
    if (k === "NAME") strictEqual(json.name, v);
    if (k === "VERSION_ID") strictEqual(json.versionId, v);
  }
});
