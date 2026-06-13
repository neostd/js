type RuntimeGlobals = typeof globalThis & {
  Deno?: { build?: { os?: string }; cwd?: () => string };
  process?: { cwd?: () => string; platform?: string };
};

export const globals: RuntimeGlobals = globalThis;

export function cwd(): string {
  if (globals.Deno?.cwd) {
    return globals.Deno.cwd();
  }
  if (globals.process?.cwd) {
    return globals.process.cwd();
  }
  if (globals.location) {
    return globals.location.href;
  }
  return "/";
}
