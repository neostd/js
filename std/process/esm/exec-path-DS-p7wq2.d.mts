//#region src/exec-path.d.ts
/**
 * Returns the path to the executable that started the current process.
 *
 * In Deno this returns an empty string unless read permission is already granted.
 */
declare function execPath(): string;
//#endregion
export { execPath as t };
