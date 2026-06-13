import { assertPath } from "./assert-path.mjs";
//#region src/common/dirname.ts
function assertArg(path) {
  assertPath(path);
  if (path.length === 0) return ".";
}
//#endregion
export { assertArg };
