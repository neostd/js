interface DenoCommandOutput {
  code: number;
  stdout: Uint8Array;
  stderr: Uint8Array;
}

interface DenoCommand {
  outputSync(): DenoCommandOutput;
}

interface DenoRuntime {
  args: string[];
  build: {
    os: string;
  };
  Command: new (
    command: string,
    options?: {
      args?: string[];
      stdout?: "inherit" | "piped" | "null";
      stderr?: "inherit" | "piped" | "null";
    },
  ) => DenoCommand;
  env: {
    get(name: string): string | undefined;
    set(name: string, value: string): void;
    delete(name: string): void;
    toObject(): Record<string, string>;
  };
}

interface BunSpawnSyncResult {
  stdout?: Uint8Array | string;
  stderr?: Uint8Array | string;
  exitCode?: number;
  error?: Error;
}

interface BunRuntime {
  spawnSync(
    command: string[],
    options?: {
      stdout?: "inherit" | "pipe" | "ignore";
      stderr?: "inherit" | "pipe" | "ignore";
      env?: Record<string, string | undefined>;
    },
  ): BunSpawnSyncResult;
}

interface ChildProcessModule {
  spawnSync(
    command: string,
    args: string[],
    options: {
      stdio: "pipe";
    },
  ): {
    stdout?: Uint8Array | string;
    stderr?: Uint8Array | string;
    error?: Error;
  };
}

type RuntimeProcess = NodeJS.Process & {
  getBuiltinModule?(module: string): unknown;
};

interface RuntimeGlobals {
  Bun?: BunRuntime;
  Deno?: DenoRuntime;
  document?: Document;
  navigator?: Navigator;
  process?: RuntimeProcess;
  window?: Window;
}

export const globals = globalThis as typeof globalThis & RuntimeGlobals;
export const BROWSER = globals.process === undefined && globals.Deno === undefined;
export const WINDOWS =
  globals.Deno?.build.os === "windows" ||
  globals.process?.platform === "win32" ||
  globals.navigator?.platform.toLowerCase().includes("win") === true;

export function getRuntimeArgs(): string[] {
  if (globals.Deno) {
    return globals.Deno.args;
  }

  if (globals.process) {
    return globals.process.argv.slice(2);
  }

  return [];
}

export function loadChildProcess(): ChildProcessModule | undefined {
  return globals.process?.getBuiltinModule?.("node:child_process") as
    | ChildProcessModule
    | undefined;
}
