//#region src/exit.d.ts
/**
 * Exits the current process with an optional status code.
 *
 * Browser environments call `window.close()` when available.
 */
declare function exit(code?: number): void;
//#endregion
export { exit as t };
