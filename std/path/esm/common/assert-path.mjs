//#region src/common/assert-path.ts
function assertPath(path) {
  if (typeof path !== "string")
    throw new TypeError(`Path must be a string, received "${JSON.stringify(path)}"`);
}
//#endregion
export { assertPath };
