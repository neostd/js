import { n as chdir } from "./chdir--StVI84v.mjs";
import { t as history } from "./history-DcABCNZv.mjs";
//#region src/pushd.ts
/** Pushes a directory onto the directory stack and changes to it. */
function pushd(directory) {
  chdir(directory);
  history.push(directory);
}
//#endregion
export { pushd as t };
