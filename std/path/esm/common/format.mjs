//#region src/common/format.ts
function _format(sep, pathObject) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || (pathObject.name ?? "") + (pathObject.ext ?? "");
  if (!dir) return base;
  if (base === sep) return dir;
  if (dir === pathObject.root) return dir + base;
  return dir + sep + base;
}
function assertArg(pathObject) {
  if (pathObject === null || typeof pathObject !== "object")
    throw new TypeError(
      `The "pathObject" argument must be of type Object, received type "${typeof pathObject}"`,
    );
}
//#endregion
export { _format, assertArg };
