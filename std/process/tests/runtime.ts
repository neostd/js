import { spawnSync } from "node:child_process";

export const isWindows = process.platform === "win32";
export const node = process.execPath;
export const bun = isWindows ? "bun.exe" : "bun";
export const hasBun =
  spawnSync(bun, ["--version"], { encoding: "utf8", stdio: "pipe" }).status === 0;
