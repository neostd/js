import { a as globals, t as BUN } from "./globals-Deml3KGm.mjs";
//#region src/streams.ts
const textDecoder = new TextDecoder();
async function* emptyAsyncIterator() {}
function createConsoleWriter(writeLine) {
  return {
    buffer: "",
    write(chunk) {
      this.writeSync(chunk);
      return Promise.resolve(chunk.length);
    },
    writeSync(chunk) {
      let message = textDecoder.decode(chunk);
      let buffer = this.buffer;
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
    isTerm() {
      return false;
    },
    close() {},
  };
}
function createEmptyReader() {
  return {
    read(_data) {
      return Promise.resolve(null);
    },
    readSync(_data) {
      return null;
    },
    isTerm() {
      return false;
    },
    close() {},
    [Symbol.asyncIterator]: emptyAsyncIterator,
  };
}
let stdinValue = createEmptyReader();
let stdoutValue = createConsoleWriter(console.log);
let stderrValue = createConsoleWriter(console.error);
if (globals.Deno) {
  const deno = globals.Deno;
  stdoutValue = {
    write(chunk) {
      return deno.stdout.write(chunk);
    },
    writeSync(chunk) {
      return deno.stdout.writeSync(chunk);
    },
    isTerm() {
      return deno.stdout.isTerminal();
    },
    close() {
      deno.stdout.close();
    },
  };
  stderrValue = {
    write(chunk) {
      return deno.stderr.write(chunk);
    },
    writeSync(chunk) {
      return deno.stderr.writeSync(chunk);
    },
    isTerm() {
      return deno.stderr.isTerminal();
    },
    close() {
      deno.stderr.close();
    },
  };
  stdinValue = {
    read(data) {
      return deno.stdin.read(data);
    },
    readSync(data) {
      return deno.stdin.readSync(data);
    },
    isTerm() {
      return deno.stdin.isTerminal();
    },
    close() {
      deno.stdin.close();
    },
    async *[Symbol.asyncIterator]() {
      const buffer = new Uint8Array(64 * 1024);
      while (true) {
        const bytesRead = await deno.stdin.read(buffer);
        if (bytesRead === null) return;
        if (bytesRead > 0) yield buffer.slice(0, bytesRead);
      }
    },
  };
} else if (globals.process) {
  const runtimeProcess = globals.process;
  const fs = await import("node:fs");
  const tty = await import("node:tty");
  function readAsync(buffer, offset, length) {
    return new Promise((resolve, reject) => {
      fs.read(runtimeProcess.stdin.fd, buffer, offset, length, null, (error, bytesRead) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(bytesRead);
      });
    });
  }
  function readSync(buffer, offset, length) {
    return fs.readSync(runtimeProcess.stdin.fd, buffer, offset, length, null);
  }
  function readIntoBuffer(data, readChunk) {
    let bytesRead = 0;
    let length = data.length;
    const handleCount = (count) => {
      bytesRead += count;
      length -= count;
      if (count === 0) return bytesRead === 0 ? null : bytesRead;
      if (bytesRead === data.length) return bytesRead;
    };
    const first = readChunk(bytesRead, length);
    if (typeof first === "number") {
      let result = handleCount(first);
      while (result === void 0) result = handleCount(readChunk(bytesRead, length));
      return result;
    }
    return (async () => {
      let result = handleCount(await first);
      while (result === void 0) result = handleCount(await readChunk(bytesRead, length));
      return result;
    })();
  }
  function handleReadError(error) {
    const nodeError = error;
    if (nodeError instanceof Error && typeof nodeError.code === "string") {
      if (nodeError.code === "EAGAIN" || nodeError.code === "EOF") return null;
    }
    throw error;
  }
  function nodeWrite(stream, chunk) {
    return new Promise((resolve, reject) => {
      stream.write(chunk, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(chunk.length);
      });
    });
  }
  async function* nodeStdinIterator() {
    for await (const chunk of runtimeProcess.stdin)
      if (typeof chunk === "string") yield new TextEncoder().encode(chunk);
      else yield new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength);
  }
  function createNodeReader() {
    return {
      async read(data) {
        try {
          return await readIntoBuffer(data, (offset, length) => readAsync(data, offset, length));
        } catch (error) {
          return handleReadError(error);
        }
      },
      readSync(data) {
        try {
          return readIntoBuffer(data, (offset, length) => readSync(data, offset, length));
        } catch (error) {
          return handleReadError(error);
        }
      },
      isTerm() {
        return tty.isatty(runtimeProcess.stdin.fd);
      },
      close() {
        runtimeProcess.stdin.destroy();
      },
      [Symbol.asyncIterator]: nodeStdinIterator,
    };
  }
  function createNodeWriter(stream) {
    return {
      write(chunk) {
        return nodeWrite(stream, chunk);
      },
      writeSync(chunk) {
        return fs.writeSync(stream.fd, chunk);
      },
      isTerm() {
        return tty.isatty(stream.fd);
      },
      close() {
        stream.end();
      },
    };
  }
  function createBunWriter(destination, fallback) {
    let writer;
    function getWriter() {
      return (writer ??= destination.writer());
    }
    return {
      write(chunk) {
        return globals.Bun?.write(destination, chunk) ?? nodeWrite(fallback, chunk);
      },
      writeSync(chunk) {
        const bytesWritten = getWriter().write(chunk);
        if (getWriter().flush() instanceof Promise) {
        }
        return bytesWritten;
      },
      isTerm() {
        return tty.isatty(fallback.fd);
      },
      close() {
        writer?.end();
      },
    };
  }
  function createBunReader() {
    let reader;
    let pending;
    async function readFromStream(data) {
      reader ??= globals.Bun?.stdin.stream().getReader();
      if (!reader) return null;
      let bytesRead = 0;
      while (bytesRead < data.length) {
        if (pending && pending.length > 0) {
          const bytesToCopy = Math.min(data.length - bytesRead, pending.length);
          data.set(pending.subarray(0, bytesToCopy), bytesRead);
          bytesRead += bytesToCopy;
          pending = pending.length > bytesToCopy ? pending.subarray(bytesToCopy) : void 0;
          continue;
        }
        const result = await reader.read();
        if (result.done) return bytesRead === 0 ? null : bytesRead;
        pending = result.value;
      }
      return bytesRead;
    }
    return {
      read(data) {
        return readFromStream(data);
      },
      readSync(data) {
        try {
          return readIntoBuffer(data, (offset, length) => readSync(data, offset, length));
        } catch (error) {
          return handleReadError(error);
        }
      },
      isTerm() {
        return tty.isatty(runtimeProcess.stdin.fd);
      },
      close() {
        reader?.releaseLock();
        runtimeProcess.stdin.destroy();
      },
      async *[Symbol.asyncIterator]() {
        const streamReader = globals.Bun?.stdin.stream().getReader();
        if (!streamReader) return;
        try {
          while (true) {
            const result = await streamReader.read();
            if (result.done) return;
            yield result.value;
          }
        } finally {
          streamReader.releaseLock();
        }
      },
    };
  }
  if (BUN && globals.Bun) {
    stdoutValue = createBunWriter(globals.Bun.stdout, runtimeProcess.stdout);
    stderrValue = createBunWriter(globals.Bun.stderr, runtimeProcess.stderr);
    stdinValue = createBunReader();
  } else {
    stdoutValue = createNodeWriter(runtimeProcess.stdout);
    stderrValue = createNodeWriter(runtimeProcess.stderr);
    stdinValue = createNodeReader();
  }
}
/** The standard input stream of the process. */
const stdin = stdinValue;
/** The standard output stream of the process. */
const stdout = stdoutValue;
/** The standard error stream of the process. */
const stderr = stderrValue;
//#endregion
export { stdin as n, stdout as r, stderr as t };
