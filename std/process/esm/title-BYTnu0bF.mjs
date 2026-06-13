import { a as globals } from "./globals-Deml3KGm.mjs";
//#region src/title.ts
/**
 * Cross-runtime process title abstraction.
 *
 * Browsers map this to `document.title` when `document` is available.
 */
const title = {
  get() {
    if (globals.process) return globals.process.title;
    return globals.document?.title ?? globals.window?.document?.title ?? "";
  },
  set(value) {
    if (globals.process) {
      globals.process.title = value;
      return;
    }
    const document = globals.document ?? globals.window?.document;
    if (document) document.title = value;
  },
  isSupported() {
    return (
      globals.process !== void 0 ||
      globals.document !== void 0 ||
      globals.window?.document !== void 0
    );
  },
};
//#endregion
export { title as t };
