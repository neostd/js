//#region src/common/from-file-url.ts
function assertArg(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol !== "file:")
    throw new TypeError(`URL must be a file URL: received "${url.protocol}"`);
  return url;
}
//#endregion
export { assertArg };
