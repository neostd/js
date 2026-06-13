//#region src/title.d.ts
/** Cross-runtime process or document title access. */
interface ProcessTitle {
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
declare const title: ProcessTitle;
//#endregion
export { title as n, ProcessTitle as t };
