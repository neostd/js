//#region src/types.d.ts
/**
 * Shared types for the macOS OS Release detection module.
 *
 * @module
 */
/** macOS version information. */
interface OsRelease {
  id: string;
  name: string;
  prettyName: string;
  version: string;
  versionId: string;
  versionCodename: string;
  buildId: string;
  variant: string;
}
//#endregion
export { OsRelease };
