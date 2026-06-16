//#region src/types.d.ts
/**
 * Shared types for the Linux OS Release detection module.
 *
 * @module
 */
/** Parsed /etc/os-release fields. */
interface OsRelease extends Record<string, string | undefined> {
  id: string;
  idLike: string;
  name: string;
  prettyName: string;
  version: string;
  versionId: string;
  versionCodename: string;
  variant: string;
  variantId: string;
  buildId: string;
  homeUrl: string;
  supportUrl: string;
  bugReportUrl: string;
  privacyPolicyUrl: string;
  logo: string;
  cpeName: string;
}
//#endregion
export { OsRelease };
