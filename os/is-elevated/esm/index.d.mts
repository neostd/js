//#region src/index.d.ts
/**
 * Detect whether the current process is running with elevated privileges.
 *
 * On Unix-like systems this typically means the process is running as root. On
 * Windows it means the current process token is elevated.
 *
 * @example Usage
 * ```ts
 * import { isElevated } from "@neostd/is-elevated";
 *
 * if (!isElevated()) {
 *   throw new Error("This action requires sudo or admin rights");
 * }
 * ```
 *
 * @module
 */
/**
 * Determines whether the current process is elevated.
 *
 * @example Usage
 * ```ts
 * import { isElevated } from "@neostd/is-elevated";
 *
 * if (isElevated()) {
 *   console.log("Running with elevated privileges");
 * }
 * ```
 *
 * @param cache When `true`, reuse the cached detection result from the selected runtime implementation.
 * @returns `true` when the current process is elevated, otherwise `false`.
 */
declare function isElevated(cache?: boolean): boolean;
//#endregion
export { isElevated };
