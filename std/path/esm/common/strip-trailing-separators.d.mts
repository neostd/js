//#region src/common/strip-trailing-separators.d.ts
declare function stripTrailingSeparators(segment: string, isSep: (char: number) => boolean): string;
//#endregion
export { stripTrailingSeparators };
