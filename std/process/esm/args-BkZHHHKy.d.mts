//#region src/args.d.ts
/**
 * The current process arguments without the executable path or script path.
 *
 * @example
 * ```ts
 * import { args } from "@neostd/process/args";
 * console.log(args);
 * ```
 */
declare const args: ReadonlyArray<string>;
//#endregion
export { args as t };
