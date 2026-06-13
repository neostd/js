//#region src/globals.ts
const globals = globalThis;
const DENO = globals.Deno !== void 0;
const BUN = globals.process?.versions?.bun !== void 0;
const NODE = globals.process !== void 0 && !BUN;
const NODELIKE = globals.process !== void 0;
//#endregion
export { globals as a, NODELIKE as i, DENO as n, NODE as r, BUN as t };
