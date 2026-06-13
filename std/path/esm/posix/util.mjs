import { CHAR_FORWARD_SLASH } from "@neostd/chars/constants";
//#region src/posix/util.ts
function isPosixPathSeparator(code) {
  return code === CHAR_FORWARD_SLASH;
}
//#endregion
export { isPosixPathSeparator };
