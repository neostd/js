//#region src/globals.d.ts
declare const globals: typeof globalThis & {
  Deno?: {
    build?: {
      os?: string;
    };
  };
  process?: {
    platform?: string;
  };
  navigator?: {
    platform?: string;
  };
};
declare const WINDOWS: boolean;
declare const EOL: string;
//#endregion
export { EOL, WINDOWS, globals };
