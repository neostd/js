//#region src/globals.d.ts
interface DenoPermissionStatus {
  state: "granted" | "denied" | "prompt";
}
interface DenoReader {
  read(data: Uint8Array): Promise<number | null>;
  readSync(data: Uint8Array): number | null;
  isTerminal(): boolean;
  close(): void;
}
interface DenoWriter {
  write(data: Uint8Array): Promise<number>;
  writeSync(data: Uint8Array): number;
  isTerminal(): boolean;
  close(): void;
}
interface DenoRuntime {
  args: string[];
  pid: number;
  build: {
    os: string;
  };
  cwd(): string;
  chdir(directory: string): void;
  exit(code?: number): never;
  execPath(): string;
  kill(pid: number, signal?: string | number): void;
  env: {
    get(name: string): string | undefined;
    set(name: string, value: string): void;
    delete(name: string): void;
    toObject(): Record<string, string>;
  };
  permissions: {
    querySync(permission: { name: "read" }): DenoPermissionStatus;
  };
  stdin: DenoReader;
  stdout: DenoWriter;
  stderr: DenoWriter;
}
interface BunWriter {
  write(data: Uint8Array): number;
  flush(): number | Promise<number>;
  end(): void;
}
interface BunFile {
  stream(): ReadableStream<Uint8Array>;
  writer(): BunWriter;
}
interface BunRuntime {
  stdin: BunFile;
  stdout: BunFile;
  stderr: BunFile;
  write(destination: BunFile, data: Uint8Array): Promise<number>;
}
interface RuntimeGlobals {
  Bun?: BunRuntime;
  Deno?: DenoRuntime;
  document?: Document;
  process?: NodeJS.Process;
  window?: Window;
  navigator?: Navigator;
}
declare const globals: typeof globalThis & RuntimeGlobals;
declare const DENO: boolean;
declare const BUN: boolean;
declare const NODE: boolean;
declare const NODELIKE: boolean;
//#endregion
export { BUN, DENO, NODE, NODELIKE, globals };
