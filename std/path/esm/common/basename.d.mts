//#region src/common/basename.d.ts
declare function stripSuffix(name: string, suffix: string): string;
declare function lastPathSegment(
  path: string,
  isSep: (char: number) => boolean,
  start?: number,
): string;
declare function assertArgs(path: string, suffix: string): string | undefined;
//#endregion
export { assertArgs, lastPathSegment, stripSuffix };
