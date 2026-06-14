import { createRequire } from "node:module";

const globalObject = globalThis as typeof globalThis & Record<string, unknown>;

export { globalObject as globals };

export const WINDOWS =
  typeof globalObject.process === "object"
    ? (globalObject.process as { platform?: string }).platform === "win32"
    : typeof globalObject.Deno === "object"
      ? (globalObject.Deno as { build: { os: string } }).build.os === "windows"
      : typeof globalObject.navigator === "object"
        ? /Win/.test((globalObject.navigator as { userAgent?: string }).userAgent ?? "")
        : false;

export const DARWIN =
  typeof globalObject.process === "object"
    ? (globalObject.process as { platform?: string }).platform === "darwin"
    : typeof globalObject.Deno === "object"
      ? (globalObject.Deno as { build: { os: string } }).build.os === "darwin"
      : typeof globalObject.navigator === "object"
        ? /Mac/.test((globalObject.navigator as { userAgent?: string }).userAgent ?? "")
        : false;

export function loadOsModule(): typeof import("node:os") | undefined {
  try {
    const require = createRequire(import.meta.url);
    return require("node:os") as typeof import("node:os");
  } catch {
    return undefined;
  }
}
