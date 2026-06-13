export const globals = globalThis as Record<string, any>;
export const WINDOWS = globals.process?.platform === "win32";
