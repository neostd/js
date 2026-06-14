# @neostd/env

Cross-runtime environment variable, PATH, and shell-style expansion utilities for Deno, Bun, Node, browsers, and worker
runtimes.

![logo](https://raw.githubusercontent.com/neostd/js/refs/heads/dev/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@neostd/env)](https://jsr.io/@neostd/env)
[![npm version](https://badge.fury.io/js/@neostd%2Fenv.svg)](https://badge.fury.io/js/@neostd%2Fenv)
[![GitHub version](https://badge.fury.io/gh/neostd%2Fjs.svg)](https://badge.fury.io/gh/neostd%2Fjs)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@neostd/env/doc).

A list of other modules can be found at [github.com/neostd/js](https://github.com/neostd/js).

## Installation

```bash
# Deno
deno add jsr:@neostd/env

# npm from JSR
npx jsr add @neostd/env

# npm
npm install @neostd/env
```

## Quick Start

```ts
import * as env from "@neostd/env";

env.set("MY_VAR", "test");
console.log(env.get("MY_VAR"));
// test

console.log(env.expand("${MY_VAR}"));
// test

console.log(env.expand("${NO_VALUE:-default}"));
// default

env.expand("${NO_VALUE:=assigned}");
console.log(env.get("NO_VALUE"));

console.log(env.proxy.NO_VALUE);

console.log(env.user());
console.log(env.home());
console.log(env.shell());
console.log(env.hostname());
console.log(env.path());
```

## Functions

| Function      | Subpath              | Description                                                  |
| ------------- | -------------------- | ------------------------------------------------------------ |
| `appendPath`  | `@neostd/env`        | Appends an entry to the environment PATH.                    |
| `expand`      | `@neostd/env`        | Expands a template with environment variables.               |
| `expand`      | `@neostd/env/expand` | Lower-level expansion function with custom get/set handlers. |
| `expandAsync` | `@neostd/env/expand` | Async expansion with protocol handlers for secret fetching.  |
| `get`         | `@neostd/env`        | Gets an environment variable.                                |
| `path`        | `@neostd/env`        | Gets the environment PATH value.                             |
| `has`         | `@neostd/env`        | Checks whether an environment variable is set.               |
| `hasPath`     | `@neostd/env`        | Checks whether PATH contains an entry.                       |
| `home`        | `@neostd/env`        | Gets `HOME` or `USERPROFILE`.                                |
| `hostname`    | `@neostd/env`        | Gets `HOSTNAME` or `COMPUTERNAME`.                           |
| `joinPath`    | `@neostd/env`        | Joins PATH entries using the runtime separator.              |
| `merge`       | `@neostd/env`        | Merges values into the environment.                          |
| `os`          | `@neostd/env`        | Gets `OS` or `OSTYPE`.                                       |
| `prependPath` | `@neostd/env`        | Prepends an entry to PATH.                                   |
| `remove`      | `@neostd/env`        | Removes an environment variable.                             |
| `removePath`  | `@neostd/env`        | Removes an entry from PATH.                                  |
| `replacePath` | `@neostd/env`        | Replaces an entry in PATH.                                   |
| `set`         | `@neostd/env`        | Sets an environment variable.                                |
| `setPath`     | `@neostd/env`        | Sets the environment PATH value.                             |
| `shell`       | `@neostd/env`        | Gets `SHELL` or `ComSpec`.                                   |
| `splitPath`   | `@neostd/env`        | Splits PATH into entries.                                    |
| `toObject`    | `@neostd/env`        | Clones all environment variables into a plain object.        |
| `union`       | `@neostd/env`        | Adds values that are not already set.                        |
| `user`        | `@neostd/env`        | Gets `USER` or `USERNAME`.                                   |

## Variables

| Variable | Subpath       | Description                                                         |
| -------- | ------------- | ------------------------------------------------------------------- |
| `proxy`  | `@neostd/env` | Node-like environment proxy for property reads, writes, and delete. |

## Types

| Type                  | Subpath              | Description                                 |
| --------------------- | -------------------- | ------------------------------------------- |
| `EnvProxy`            | `@neostd/env`        | Shape of the Node-like environment proxy.   |
| `SubstitutionOptions` | `@neostd/env/expand` | Options for variable and command expansion. |

## Expansion

`expand` supports bash-style variables, optional Windows-style variables, defaults, assignment, and custom errors.

```ts
import { expand, get, set } from "@neostd/env";

set("NAME", "Alice");

expand("Hello, ${NAME}!");
// Hello, Alice!

expand("Hello, $NAME!");
// Hello, Alice!

expand("${PORT:-3000}");
// 3000

expand("${PORT:=3000}");
get("PORT");
// 3000

expand("%NAME%", { windowsExpansion: true });
// Alice
```

Command substitution is disabled by default and only works in runtimes that can synchronously spawn a process. When
enabled, commands execute directly by default. Set `useShell: true` to run through a shell. If `shellArgs` is omitted,
shell mode uses PowerShell on Windows and Bash elsewhere.

Using command substitution is risky because it can execute arbitrary commands. Use with caution. This is useful for
automation and scripting to retrieve secrets without putting the values on disk, but should not be used within applications.

Using the protocolHandler is safer for applications.

```ts
import { expand } from "@neostd/env";

expand("node_version=$(node --version)", { commandSubstitution: true });
// node_version=v22.0.0

expand('secret=$(echo "value")', { commandSubstitution: true, useShell: true });
// secret=value

expand('custom=$(echo "value")', {
  commandSubstitution: true,
  shellArgs: ["bash", "-c"],
  useShell: true,
});
// custom=value
```

The `@neostd/env/expand` subpath does not read the process environment automatically. Pass custom accessors through
`SubstitutionOptions` when using it directly.

For API-backed secret lookups or other URI-based resolvers, use `expandAsync` with `protocolHandler`. This is a safer
alternative to command substitution when you need to fetch data from a scheme such as `keepass:///...` or `https://...`.

```ts
import { expandAsync } from "@neostd/env/expand";

const result = await expandAsync("secret=${SECRET_URL}", {
  get: (key) => (key === "SECRET_URL" ? "keepass:///db.kdbx?key=path/to/key" : undefined),
  protocolHandler: async (url) => {
    if (url.startsWith("keepass:///")) {
      return "resolved-secret";
    }

    return url;
  },
});

console.log(result);
// secret=resolved-secret
```

## Proxy

`proxy` behaves like Node's `process.env`. Browser and worker runtimes without process environment APIs use an isolated
in-memory store.

```ts
import { proxy as env } from "@neostd/env";

env.MY_VAR = "test";
console.log(env.MY_VAR);
// test

delete env.MY_VAR;
```

## PATH Helpers

PATH helpers use `Path` with `;` on Windows desktop runtimes and `PATH` with `:` elsewhere.

```ts
import { appendPath, getPath, hasPath, removePath } from "@neostd/env";

appendPath("/opt/tool/bin");
console.log(hasPath("/opt/tool/bin"));
// true

console.log(getPath());

removePath("/opt/tool/bin");
```

## Namespace Export

The `@neostd/env/export` subpath exports the core API as an `env` namespace.

```ts
import { env } from "@neostd/env/export";

env.set("KEY", "value");
console.log(env.get("KEY"));
```

## Runtime Notes

Deno uses `Deno.env`, Bun and Node use `process.env`, and browsers/workers use an in-memory store. Command substitution
uses `Deno.Command`, `Bun.spawnSync`, or Node's `node:child_process` when available.

## License

[MIT License](./LICENSE.md)
