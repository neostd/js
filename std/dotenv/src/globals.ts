const globalObject = globalThis as typeof globalThis & {
  Deno?: { build?: { os?: string } };
  process?: { platform?: string };
  navigator?: { platform?: string };
};

export const globals = globalObject;
export const WINDOWS =
  globalObject.Deno?.build?.os === "windows" ||
  globalObject.process?.platform === "win32" ||
  globalObject.navigator?.platform?.toLowerCase().includes("win") === true;
export const EOL = WINDOWS ? "\r\n" : "\n";
