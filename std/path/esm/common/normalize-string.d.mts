//#region src/common/normalize-string.d.ts
declare function normalizeString(
  path: string,
  allowAboveRoot: boolean,
  separator: string,
  isPathSeparator: (code: number) => boolean,
): string;
//#endregion
export { normalizeString };
