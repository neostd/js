import { globals } from "./globals.ts";

/** Cross-runtime process or document title access. */
export interface ProcessTitle {
  /** Gets the current process title, document title, or an empty string when unsupported. */
  get(): string;
  /** Sets the current process title or document title when supported. */
  set(value: string): void;
  /** Returns whether a mutable title is available in the current runtime. */
  isSupported(): boolean;
}

/**
 * Cross-runtime process title abstraction.
 *
 * Browsers map this to `document.title` when `document` is available.
 */
export const title: ProcessTitle = {
  get(): string {
    if (globals.process) {
      return globals.process.title;
    }

    return globals.document?.title ?? globals.window?.document?.title ?? "";
  },
  set(value: string): void {
    if (globals.process) {
      globals.process.title = value;
      return;
    }

    const document = globals.document ?? globals.window?.document;
    if (document) {
      document.title = value;
    }
  },
  isSupported(): boolean {
    return (
      globals.process !== undefined ||
      globals.document !== undefined ||
      globals.window?.document !== undefined
    );
  },
};
