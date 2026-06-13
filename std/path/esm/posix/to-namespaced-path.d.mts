//#region src/posix/to-namespaced-path.d.ts
/**
 * Converts a path to a namespaced path. This function returns the path as is on posix.
 *
 * @example Usage
 * ```ts
 * import { toNamespacedPath } from "@neostd/path/posix/to-namespaced-path";
 * import { equal } from "node:assert/strict";
 *
 * equal(toNamespacedPath("/home/foo"), "/home/foo");
 * ```
 *
 * @param path The path.
 * @returns The namespaced path.
 */
declare function toNamespacedPath(path: string): string;
//#endregion
export { toNamespacedPath };
