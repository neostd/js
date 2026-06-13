import { a as globals } from "./globals-Deml3KGm.mjs";
import { t as cwd } from "./cwd-BJTIuoZl.mjs";
//#region src/chdir.ts
const chdirHandlers = /* @__PURE__ */ new Set();
/** Error thrown when changing the current working directory fails. */
var ChangeDirectoryError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "ChangeDirectoryError";
  }
};
function emitChdir(directory) {
  if (chdirHandlers.size === 0) return;
  const event = {
    directory,
    cwd: cwd(),
  };
  const errors = [];
  for (const handler of chdirHandlers)
    try {
      handler(event);
    } catch (error) {
      errors.push(error);
    }
  if (errors.length === 1) throw errors[0];
  if (errors.length > 1) throw new AggregateError(errors, "onChdir handlers failed");
}
/**
 * Registers a callback that is invoked after `chdir` succeeds.
 *
 * @returns A disposable registration object that can also be explicitly unsubscribed.
 */
function onChdir(handler) {
  chdirHandlers.add(handler);
  return {
    unsubscribe() {
      chdirHandlers.delete(handler);
    },
    [Symbol.dispose]() {
      this.unsubscribe();
    },
  };
}
/**
 * Updates the current working directory of the process.
 *
 * In browser environments this updates `history.pushState()` when available.
 *
 * @param directory The directory to change to.
 * @throws ChangeDirectoryError if the runtime cannot change directories.
 */
function chdir(directory) {
  if (globals.Deno)
    try {
      globals.Deno.chdir(directory);
      emitChdir(directory);
      return;
    } catch (error) {
      if (!(error instanceof Error))
        throw new ChangeDirectoryError(`Unexpected error ${String(error)}`, { cause: error });
      throw new ChangeDirectoryError(error.message, { cause: error });
    }
  if (globals.process)
    try {
      globals.process.chdir(directory);
      emitChdir(directory);
      return;
    } catch (error) {
      if (!(error instanceof Error))
        throw new ChangeDirectoryError(`Unexpected error ${String(error)}`, { cause: error });
      throw new ChangeDirectoryError(error.message, { cause: error });
    }
  if (globals.window?.history) {
    globals.window.history.pushState({ url: directory }, "", directory);
    emitChdir(directory);
    return;
  }
  throw new ChangeDirectoryError("chdir is not implemented");
}
//#endregion
export { chdir as n, onChdir as r, ChangeDirectoryError as t };
