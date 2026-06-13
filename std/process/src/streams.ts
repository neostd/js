import { BUN, globals } from "./globals.ts";

/** A standard output or error stream writer. */
export interface StdWriter extends Record<string, unknown> {
  write(chunk: Uint8Array): Promise<number>;
  writeSync(chunk: Uint8Array): number;
  isTerm(): boolean;
  close(): void;
}

/** A standard input stream reader. */
export interface StdReader extends Record<string, unknown> {
  read(data: Uint8Array): Promise<number | null>;
  readSync(data: Uint8Array): number | null;
  isTerm(): boolean;
  close(): void;
  [Symbol.asyncIterator](): AsyncIterableIterator<Uint8Array>;
}

const textDecoder = new TextDecoder();

type RuntimeWriteStream = NodeJS.WriteStream & { fd: number };

async function* emptyAsyncIterator(): AsyncIterableIterator<Uint8Array> {}

function createConsoleWriter(writeLine: (message: string) => void): StdWriter {
  return {
    buffer: "",
    write(chunk: Uint8Array): Promise<number> {
      this.writeSync(chunk);
      return Promise.resolve(chunk.length);
    },
    writeSync(chunk: Uint8Array): number {
      let message = textDecoder.decode(chunk);
      let buffer = this.buffer as string;

      if (message.includes("\n")) {
        const messages = message.split("\n");
        for (let i = 0; i < messages.length - 1; i++) {
          writeLine(buffer + messages[i]);
          this.buffer = buffer = "";
        }

        message = messages[messages.length - 1] ?? "";
      }

      this.buffer = buffer + message;
      return chunk.length;
    },
    isTerm(): boolean {
      return false;
    },
    close(): void {},
  };
}

function createEmptyReader(): StdReader {
  return {
    read(_data: Uint8Array): Promise<number | null> {
      return Promise.resolve(null);
    },
    readSync(_data: Uint8Array): number | null {
      return null;
    },
    isTerm(): boolean {
      return false;
    },
    close(): void {},
    [Symbol.asyncIterator]: emptyAsyncIterator,
  };
}

let stdinValue: StdReader = createEmptyReader();
let stdoutValue: StdWriter = createConsoleWriter(console.log);
let stderrValue: StdWriter = createConsoleWriter(console.error);

if (globals.Deno) {
  const deno = globals.Deno;

  stdoutValue = {
    write(chunk: Uint8Array): Promise<number> {
      return deno.stdout.write(chunk);
    },
    writeSync(chunk: Uint8Array): number {
      return deno.stdout.writeSync(chunk);
    },
    isTerm(): boolean {
      return deno.stdout.isTerminal();
    },
    close(): void {
      deno.stdout.close();
    },
  };

  stderrValue = {
    write(chunk: Uint8Array): Promise<number> {
      return deno.stderr.write(chunk);
    },
    writeSync(chunk: Uint8Array): number {
      return deno.stderr.writeSync(chunk);
    },
    isTerm(): boolean {
      return deno.stderr.isTerminal();
    },
    close(): void {
      deno.stderr.close();
    },
  };

  stdinValue = {
    read(data: Uint8Array): Promise<number | null> {
      return deno.stdin.read(data);
    },
    readSync(data: Uint8Array): number | null {
      return deno.stdin.readSync(data);
    },
    isTerm(): boolean {
      return deno.stdin.isTerminal();
    },
    close(): void {
      deno.stdin.close();
    },
    async *[Symbol.asyncIterator](): AsyncIterableIterator<Uint8Array> {
      const buffer = new Uint8Array(64 * 1024);
      while (true) {
        const bytesRead = await deno.stdin.read(buffer);
        if (bytesRead === null) {
          return;
        }

        if (bytesRead > 0) {
          yield buffer.slice(0, bytesRead);
        }
      }
    },
  };
} else if (globals.process) {
  const runtimeProcess = globals.process;
  const fs = await import("node:fs");
  const tty = await import("node:tty");

  function readAsync(buffer: Uint8Array, offset: number, length: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      fs.read(runtimeProcess.stdin.fd, buffer, offset, length, null, (error, bytesRead) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(bytesRead);
      });
    });
  }

  function readSync(buffer: Uint8Array, offset: number, length: number): number {
    return fs.readSync(runtimeProcess.stdin.fd, buffer, offset, length, null);
  }

  function readIntoBuffer(
    data: Uint8Array,
    readChunk: (offset: number, length: number) => number | Promise<number>,
  ): Promise<number | null> | number | null {
    let bytesRead = 0;
    let length = data.length;

    const handleCount = (count: number): number | null | undefined => {
      bytesRead += count;
      length -= count;

      if (count === 0) {
        return bytesRead === 0 ? null : bytesRead;
      }

      if (bytesRead === data.length) {
        return bytesRead;
      }

      return undefined;
    };

    const first = readChunk(bytesRead, length);
    if (typeof first === "number") {
      let result = handleCount(first);
      while (result === undefined) {
        result = handleCount(readChunk(bytesRead, length) as number);
      }

      return result;
    }

    return (async () => {
      let result = handleCount(await first);
      while (result === undefined) {
        result = handleCount(await readChunk(bytesRead, length));
      }

      return result;
    })();
  }

  function handleReadError(error: unknown): null {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError instanceof Error && typeof nodeError.code === "string") {
      if (nodeError.code === "EAGAIN" || nodeError.code === "EOF") {
        return null;
      }
    }

    throw error;
  }

  function nodeWrite(stream: RuntimeWriteStream, chunk: Uint8Array): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      stream.write(chunk, (error?: Error | null) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(chunk.length);
      });
    });
  }

  async function* nodeStdinIterator(): AsyncIterableIterator<Uint8Array> {
    for await (const chunk of runtimeProcess.stdin) {
      if (typeof chunk === "string") {
        yield new TextEncoder().encode(chunk);
      } else {
        yield new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength);
      }
    }
  }

  function createNodeReader(): StdReader {
    return {
      async read(data: Uint8Array): Promise<number | null> {
        try {
          return await readIntoBuffer(data, (offset, length) => readAsync(data, offset, length));
        } catch (error) {
          return handleReadError(error);
        }
      },
      readSync(data: Uint8Array): number | null {
        try {
          return readIntoBuffer(data, (offset, length) => readSync(data, offset, length)) as
            | number
            | null;
        } catch (error) {
          return handleReadError(error);
        }
      },
      isTerm(): boolean {
        return tty.isatty(runtimeProcess.stdin.fd);
      },
      close(): void {
        runtimeProcess.stdin.destroy();
      },
      [Symbol.asyncIterator]: nodeStdinIterator,
    };
  }

  function createNodeWriter(stream: RuntimeWriteStream): StdWriter {
    return {
      write(chunk: Uint8Array): Promise<number> {
        return nodeWrite(stream, chunk);
      },
      writeSync(chunk: Uint8Array): number {
        return fs.writeSync(stream.fd, chunk);
      },
      isTerm(): boolean {
        return tty.isatty(stream.fd);
      },
      close(): void {
        stream.end();
      },
    };
  }

  function createBunWriter(
    destination: NonNullable<typeof globals.Bun>["stdout"],
    fallback: RuntimeWriteStream,
  ): StdWriter {
    let writer: ReturnType<typeof destination.writer> | undefined;

    function getWriter() {
      return (writer ??= destination.writer());
    }

    return {
      write(chunk: Uint8Array): Promise<number> {
        return globals.Bun?.write(destination, chunk) ?? nodeWrite(fallback, chunk);
      },
      writeSync(chunk: Uint8Array): number {
        const bytesWritten = getWriter().write(chunk);
        const flushed = getWriter().flush();
        if (flushed instanceof Promise) {
          void flushed;
        }

        return bytesWritten;
      },
      isTerm(): boolean {
        return tty.isatty(fallback.fd);
      },
      close(): void {
        writer?.end();
      },
    };
  }

  function createBunReader(): StdReader {
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
    let pending: Uint8Array | undefined;

    async function readFromStream(data: Uint8Array): Promise<number | null> {
      reader ??= globals.Bun?.stdin.stream().getReader();
      if (!reader) {
        return null;
      }

      let bytesRead = 0;
      while (bytesRead < data.length) {
        if (pending && pending.length > 0) {
          const bytesToCopy = Math.min(data.length - bytesRead, pending.length);
          data.set(pending.subarray(0, bytesToCopy), bytesRead);
          bytesRead += bytesToCopy;
          pending = pending.length > bytesToCopy ? pending.subarray(bytesToCopy) : undefined;
          continue;
        }

        const result = await reader.read();
        if (result.done) {
          return bytesRead === 0 ? null : bytesRead;
        }

        pending = result.value;
      }

      return bytesRead;
    }

    return {
      read(data: Uint8Array): Promise<number | null> {
        return readFromStream(data);
      },
      readSync(data: Uint8Array): number | null {
        try {
          return readIntoBuffer(data, (offset, length) => readSync(data, offset, length)) as
            | number
            | null;
        } catch (error) {
          return handleReadError(error);
        }
      },
      isTerm(): boolean {
        return tty.isatty(runtimeProcess.stdin.fd);
      },
      close(): void {
        reader?.releaseLock();
        runtimeProcess.stdin.destroy();
      },
      async *[Symbol.asyncIterator](): AsyncIterableIterator<Uint8Array> {
        const streamReader = globals.Bun?.stdin.stream().getReader();
        if (!streamReader) {
          return;
        }

        try {
          while (true) {
            const result = await streamReader.read();
            if (result.done) {
              return;
            }

            yield result.value;
          }
        } finally {
          streamReader.releaseLock();
        }
      },
    };
  }

  if (BUN && globals.Bun) {
    stdoutValue = createBunWriter(globals.Bun.stdout, runtimeProcess.stdout as RuntimeWriteStream);
    stderrValue = createBunWriter(globals.Bun.stderr, runtimeProcess.stderr as RuntimeWriteStream);
    stdinValue = createBunReader();
  } else {
    stdoutValue = createNodeWriter(runtimeProcess.stdout as RuntimeWriteStream);
    stderrValue = createNodeWriter(runtimeProcess.stderr as RuntimeWriteStream);
    stdinValue = createNodeReader();
  }
}

/** The standard input stream of the process. */
export const stdin: StdReader = stdinValue;

/** The standard output stream of the process. */
export const stdout: StdWriter = stdoutValue;

/** The standard error stream of the process. */
export const stderr: StdWriter = stderrValue;
