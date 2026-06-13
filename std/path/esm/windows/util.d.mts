//#region src/windows/util.d.ts
declare function isPosixPathSeparator(code: number): boolean;
declare function isPathSeparator(code: number): boolean;
declare function isWindowsDeviceRoot(code: number): boolean;
//#endregion
export { isPathSeparator, isPosixPathSeparator, isWindowsDeviceRoot };
