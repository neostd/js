import { createRequire } from "node:module";
//#region src/globals.ts
const globalObject = globalThis;
const WINDOWS = typeof globalObject.process === "object" ? globalObject.process.platform === "win32" : typeof globalObject.Deno === "object" ? globalObject.Deno.build.os === "windows" : typeof globalObject.navigator === "object" ? /Win/.test(globalObject.navigator.userAgent ?? "") : false;
const DARWIN = typeof globalObject.process === "object" ? globalObject.process.platform === "darwin" : typeof globalObject.Deno === "object" ? globalObject.Deno.build.os === "darwin" : typeof globalObject.navigator === "object" ? /Mac/.test(globalObject.navigator.userAgent ?? "") : false;
function loadOsModule() {
	try {
		return createRequire(import.meta.url)("node:os");
	} catch {
		return;
	}
}
//#endregion
export { DARWIN, WINDOWS, globalObject as globals, loadOsModule };
