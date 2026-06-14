//#region src/node.d.ts
/**
 * Detects elevation in plain Node.js environments without platform FFI.
 *
 * On Unix-like systems this checks whether `process.getuid()` is `0`. On
 * Windows and other environments where `getuid()` is unavailable, it returns
 * `false`.
 *
 * @param cache When `true`, reuse the previously computed result.
 * @returns `true` when the current user ID is root, otherwise `false`.
 */
declare function evalIsProcessElevated(cache?: boolean): boolean;
//#endregion
export { evalIsProcessElevated };
