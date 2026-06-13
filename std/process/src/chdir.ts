import { globals } from "./globals.ts";
import { cwd } from "./cwd.ts";

/** Information passed to `onChdir` handlers after a successful directory change. */
export interface ChdirEvent {
  /** The directory argument passed to `chdir`. */
  directory: string;
  /** The current working directory after `chdir` succeeds. */
  cwd: string;
}

/** Callback invoked after `chdir` succeeds. */
export type ChdirHandler = (event: ChdirEvent) => void;

/** Registration returned by `onChdir`. */
export interface ChdirRegistration {
  /** Removes the registered handler. Safe to call more than once. */
  unsubscribe(): void;
  /** Removes the registered handler when used with the `using` keyword. */
  [Symbol.dispose](): void;
}

const chdirHandlers = new Set<ChdirHandler>();

/** Error thrown when changing the current working directory fails. */
export class ChangeDirectoryError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ChangeDirectoryError";
  }
}

function emitChdir(directory: string): void {
  if (chdirHandlers.size === 0) {
    return;
  }

  const event: ChdirEvent = { directory, cwd: cwd() };
  const errors: unknown[] = [];

  for (const handler of chdirHandlers) {
    try {
      handler(event);
    } catch (error) {
      errors.push(error);
    }
  }

  if (errors.length === 1) {
    throw errors[0];
  }

  if (errors.length > 1) {
    throw new AggregateError(errors, "onChdir handlers failed");
  }
}

/**
 * Registers a callback that is invoked after `chdir` succeeds.
 *
 * @returns A disposable registration object that can also be explicitly unsubscribed.
 */
export function onChdir(handler: ChdirHandler): ChdirRegistration {
  chdirHandlers.add(handler);

  return {
    unsubscribe(): void {
      chdirHandlers.delete(handler);
    },
    [Symbol.dispose](): void {
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
export function chdir(directory: string): void {
  if (globals.Deno) {
    try {
      globals.Deno.chdir(directory);
      emitChdir(directory);
      return;
    } catch (error) {
      if (!(error instanceof Error)) {
        throw new ChangeDirectoryError(`Unexpected error ${String(error)}`, { cause: error });
      }

      throw new ChangeDirectoryError(error.message, { cause: error });
    }
  }

  if (globals.process) {
    try {
      globals.process.chdir(directory);
      emitChdir(directory);
      return;
    } catch (error) {
      if (!(error instanceof Error)) {
        throw new ChangeDirectoryError(`Unexpected error ${String(error)}`, { cause: error });
      }

      throw new ChangeDirectoryError(error.message, { cause: error });
    }
  }

  if (globals.window?.history) {
    globals.window.history.pushState({ url: directory }, "", directory);
    emitChdir(directory);
    return;
  }

  throw new ChangeDirectoryError("chdir is not implemented");
}
