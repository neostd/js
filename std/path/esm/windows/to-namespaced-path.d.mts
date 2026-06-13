//#region src/windows/to-namespaced-path.d.ts
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
declare function toNamespacedPath(path: string): string;
//#endregion
export { toNamespacedPath };
