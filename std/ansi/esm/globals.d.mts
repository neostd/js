//#region src/globals.d.ts
declare const globalObject: typeof globalThis & Record<string, unknown>;
declare const WINDOWS: boolean;
declare const DARWIN: boolean;
declare function loadOsModule(): typeof import("node:os") | undefined;
//#endregion
export { DARWIN, WINDOWS, globalObject as globals, loadOsModule };