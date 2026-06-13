import { ParsedPath } from "../types.mjs";

//#region src/common/format.d.ts
declare function _format(sep: string, pathObject: Partial<ParsedPath>): string;
declare function assertArg(pathObject: Partial<ParsedPath>): void;
//#endregion
export { _format, assertArg };
