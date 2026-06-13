//#region src/cwd.d.ts
/**
 * Gets the current working directory of the process.
 *
 * In browser environments this returns the last URL stored in history state or `location.pathname`.
 */
declare function cwd(): string;
//#endregion
export { cwd as t };
