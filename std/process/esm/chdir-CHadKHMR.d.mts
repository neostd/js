//#region src/chdir.d.ts
/** Information passed to `onChdir` handlers after a successful directory change. */
interface ChdirEvent {
  /** The directory argument passed to `chdir`. */
  directory: string;
  /** The current working directory after `chdir` succeeds. */
  cwd: string;
}
/** Callback invoked after `chdir` succeeds. */
type ChdirHandler = (event: ChdirEvent) => void;
/** Registration returned by `onChdir`. */
interface ChdirRegistration {
  /** Removes the registered handler. Safe to call more than once. */
  unsubscribe(): void;
  /** Removes the registered handler when used with the `using` keyword. */
  [Symbol.dispose](): void;
}
/** Error thrown when changing the current working directory fails. */
declare class ChangeDirectoryError extends Error {
  constructor(message: string, options?: ErrorOptions);
}
/**
 * Registers a callback that is invoked after `chdir` succeeds.
 *
 * @returns A disposable registration object that can also be explicitly unsubscribed.
 */
declare function onChdir(handler: ChdirHandler): ChdirRegistration;
/**
 * Updates the current working directory of the process.
 *
 * In browser environments this updates `history.pushState()` when available.
 *
 * @param directory The directory to change to.
 * @throws ChangeDirectoryError if the runtime cannot change directories.
 */
declare function chdir(directory: string): void;
//#endregion
export {
  chdir as a,
  ChdirRegistration as i,
  ChdirEvent as n,
  onChdir as o,
  ChdirHandler as r,
  ChangeDirectoryError as t,
};
