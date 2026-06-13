import { assertPath } from "./assert-path.mjs";
//#region src/common/relative.ts
function assertArgs(from, to) {
  assertPath(from);
  assertPath(to);
  if (from === to) return "";
}
//#endregion
export { assertArgs };
