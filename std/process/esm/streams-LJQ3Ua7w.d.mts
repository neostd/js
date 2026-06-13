//#region src/streams.d.ts
/** A standard output or error stream writer. */
interface StdWriter extends Record<string, unknown> {
  write(chunk: Uint8Array): Promise<number>;
  writeSync(chunk: Uint8Array): number;
  isTerm(): boolean;
  close(): void;
}
/** A standard input stream reader. */
interface StdReader extends Record<string, unknown> {
  read(data: Uint8Array): Promise<number | null>;
  readSync(data: Uint8Array): number | null;
  isTerm(): boolean;
  close(): void;
  [Symbol.asyncIterator](): AsyncIterableIterator<Uint8Array>;
}
/** The standard input stream of the process. */
declare const stdin: StdReader;
/** The standard output stream of the process. */
declare const stdout: StdWriter;
/** The standard error stream of the process. */
declare const stderr: StdWriter;
//#endregion
export { stdout as a, stdin as i, StdWriter as n, stderr as r, StdReader as t };
