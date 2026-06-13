import { isWindowsDeviceRoot } from "./util.mjs";
import { resolve } from "./resolve.mjs";
import {
  CHAR_BACKWARD_SLASH,
  CHAR_COLON,
  CHAR_DOT,
  CHAR_QUESTION_MARK,
} from "@neostd/chars/constants";
//#region src/windows/to-namespaced-path.ts
/**
 * Resolves path to a namespace path
 *
 * @example Usage
 * ```ts
 * import { toNamespacedPath } from "@neostd/path/windows/to-namespaced-path";
 * import { equal } from "node:assert/strict";
 *
 * const namespaced = toNamespacedPath("C:\\foo\\bar");
 * equal(namespaced, "\\\\?\\C:\\foo\\bar");
 * ```
 *
 * @param path The path to resolve to namespaced path
 * @returns The resolved namespaced path
 */
function toNamespacedPath(path) {
  if (typeof path !== "string") return path;
  if (path.length === 0) return "";
  const resolvedPath = resolve(path);
  if (resolvedPath.length >= 3) {
    if (resolvedPath.charCodeAt(0) === CHAR_BACKWARD_SLASH) {
      if (resolvedPath.charCodeAt(1) === CHAR_BACKWARD_SLASH) {
        const code = resolvedPath.charCodeAt(2);
        if (code !== CHAR_QUESTION_MARK && code !== CHAR_DOT)
          return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
      }
    } else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
      if (
        resolvedPath.charCodeAt(1) === CHAR_COLON &&
        resolvedPath.charCodeAt(2) === CHAR_BACKWARD_SLASH
      )
        return `\\\\?\\${resolvedPath}`;
    }
  }
  return path;
}
//#endregion
export { toNamespacedPath };
