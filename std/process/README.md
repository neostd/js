# @neostd/process

Cross-runtime process utilities for process ID, command-line arguments, executable path, current working directory,
directory navigation, process exit, and standard streams.

## Installation

```bash
deno add jsr:@neostd/process
npx jsr add @neostd/process
npm install @neostd/process
```

## Usage

```ts
import { args, chdir, cwd, execPath, pid, stdout } from "@neostd/process";

console.log("PID:", pid);
console.log("Args:", args);
console.log("Executable:", execPath());
console.log("Working directory:", cwd());

chdir("..");
stdout.writeSync(new TextEncoder().encode(`Now in ${cwd()}\n`));
```

## Exports

| Export                                     | Subpath                     | Description                                               |
| ------------------------------------------ | --------------------------- | --------------------------------------------------------- |
| `args`                                     | `@neostd/process/args`      | Command-line arguments without executable or script path. |
| `chdir`, `onChdir`, `ChangeDirectoryError` | `@neostd/process/chdir`     | Change the current working directory and observe changes. |
| `cwd`                                      | `@neostd/process/cwd`       | Read the current working directory.                       |
| `env`                                      | `@neostd/process/env`       | Read and mutate environment variables.                    |
| `execPath`                                 | `@neostd/process/exec-path` | Read the executable path.                                 |
| `exit`                                     | `@neostd/process/exit`      | Exit the current process.                                 |
| `kill`                                     | `@neostd/process/kill`      | Signal a process when supported.                          |
| `pid`                                      | `@neostd/process/pid`       | Current process ID.                                       |
| `popd`                                     | `@neostd/process/popd`      | Pop a directory from the process directory stack.         |
| `pushd`                                    | `@neostd/process/pushd`     | Push a directory onto the process directory stack.        |
| `stdin`, `stdout`, `stderr`                | `@neostd/process/streams`   | Standard input, output, and error streams.                |
| `title`                                    | `@neostd/process/title`     | Read and mutate the process or document title.            |

`env` behaves like Node's `process.env`:

```ts
import { env } from "@neostd/process/env";

env.MY_FLAG = "1";
console.log(env.MY_FLAG);
delete env.MY_FLAG;
```

`onChdir` returns a disposable registration. You can remove handlers explicitly with `unsubscribe()` or with the `using`
keyword:

```ts
import { chdir, onChdir } from "@neostd/process/chdir";

const registration = onChdir(({ cwd }) => {
  console.log(cwd);
});

chdir("..");
registration.unsubscribe();

using scoped = onChdir(({ directory }) => {
  console.log(directory);
});
```

`stdin` also implements `AsyncIterable<Uint8Array>`:

```ts
import { stdin, stdout } from "@neostd/process/streams";

for await (const chunk of stdin) {
  await stdout.write(chunk);
}
```

## Runtime Notes

Bun uses native `Bun.stdout`, `Bun.stderr`, and `Bun.stdin.stream()` where they fit the stream contract, with
Node-compatible fd APIs as fallback for synchronous stdin reads and terminal checks. Node uses `process`, `node:fs`, and
`node:tty`. Deno uses `Deno.*` APIs when available. Browser support is limited to lightweight fallbacks: `kill()` returns
`false`, `env` uses an isolated in-memory store, and `title` maps to `document.title` when available.
