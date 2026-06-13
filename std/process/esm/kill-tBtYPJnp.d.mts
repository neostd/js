//#region src/kill.d.ts
type KillSignal = NodeJS.Signals | number;
/**
 * Sends a signal to a process.
 *
 * Returns `false` in browser environments because browsers cannot signal OS processes.
 */
declare function kill(pid: number, signal?: KillSignal): boolean;
//#endregion
export { kill as n, KillSignal as t };
