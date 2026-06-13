//#region src/tables/latin1.d.ts
declare const pC: number;
declare const pP: number;
declare const pN: number;
declare const pS: number;
declare const pZ: number;
declare const pLu: number;
declare const pLl: number;
declare const pp: number;
declare const pg: number;
declare const pLo: number;
declare const pLmask: number;
declare const latin1: number[];
declare function is16(v: Array<number[]>, char: number): boolean;
declare function is32(v: Array<number[]>, char: number): boolean;
//#endregion
export { is16, is32, latin1, pC, pLl, pLmask, pLo, pLu, pN, pP, pS, pZ, pg, pp };
