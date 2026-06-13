//#region src/globals.d.ts
type RuntimeGlobals = typeof globalThis & {
  Deno?: {
    build?: {
      os?: string;
    };
    cwd?: () => string;
  };
  process?: {
    cwd?: () => string;
    platform?: string;
  };
};
declare const globals: RuntimeGlobals;
declare function cwd(): string;
//#endregion
export { cwd, globals };
