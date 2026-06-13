import { n as chdir } from "./chdir--StVI84v.mjs";
import { t as history } from "./history-DcABCNZv.mjs";
//#region src/popd.ts
/**
 * Pops the last directory from the directory stack and changes to it.
 *
 * @returns The popped directory, or `undefined` if the stack is empty.
 */
function popd() {
  const directory = history.pop();
  if (directory) {
    chdir(directory);
    return directory;
  }
}
//#endregion
export { popd as t };
