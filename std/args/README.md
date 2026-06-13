# @neostd/args

Cross-runtime command-line argument utilities for splitting shell-like strings, joining argument arrays, converting
objects to args, and parsing args into JSON-like objects.

![logo](https://raw.githubusercontent.com/neostd/js/refs/heads/master/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@neostd/args)](https://jsr.io/@neostd/args)
[![npm version](https://badge.fury.io/js/@neostd%2Fargs.svg)](https://badge.fury.io/js/@neostd%2Fargs)
[![GitHub version](https://badge.fury.io/gh/neostd%2Fjs.svg)](https://badge.fury.io/gh/neostd%2Fjs)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@neostd/args/doc).

A list of other modules can be found at [github.com/neostd/js](https://github.com/neostd/js).

## Installation

```bash
# Deno
deno add jsr:@neostd/args

# npm from JSR
npx jsr add @neostd/args

# npm
npm install @neostd/args
```

## Quick Start

```ts
import { join, parse, splat, split } from "@neostd/args";

const command = 'git commit -m "initial commit" --no-verify';
const tokens = split(command);
console.log(tokens);
// ["git", "commit", "-m", "initial commit", "--no-verify"]

console.log(join(tokens));
// git commit -m "initial commit" --no-verify

console.log(splat({ all: true, output: "dist/app.js", "*": ["build"] }));
// ["build", "--all", "--output", "dist/app.js"]

console.log(parse(["--name", "neo", "--count=2", "-v", "input.txt"], { boolean: ["v"] }));
// { _: ["input.txt"], name: "neo", count: 2, v: true }
```

## Functions

| Function      | Subpath              | Description                                              |
| ------------- | -------------------- | -------------------------------------------------------- |
| `split`       | `@neostd/args/split` | Splits a shell-like command string into argument tokens. |
| `join`        | `@neostd/args/join`  | Joins args using current-platform quoting rules.         |
| `unixJoin`    | `@neostd/args/join`  | Joins args using Unix shell quoting rules.               |
| `windowsJoin` | `@neostd/args/join`  | Joins args using Windows command-line quoting rules.     |
| `splat`       | `@neostd/args/splat` | Converts an object into an array of command-line args.   |
| `parse`       | `@neostd/args/parse` | Parses command-line args into a JSON-like object.        |

## Variables

| Variable       | Subpath              | Description                                                                        |
| -------------- | -------------------- | ---------------------------------------------------------------------------------- |
| `SplatSymbols` | `@neostd/args/splat` | Symbol keys for command, positional, remaining, and extra args in `splat` objects. |

## Types

| Type             | Subpath              | Description                             |
| ---------------- | -------------------- | --------------------------------------- |
| `ParsedArgs`     | `@neostd/args/parse` | Result object returned by `parse`.      |
| `ParsedArgValue` | `@neostd/args/parse` | Scalar or repeated parsed option value. |
| `ParseOptions`   | `@neostd/args/parse` | Options for `parse`.                    |
| `SplatObject`    | `@neostd/args/splat` | Object accepted by `splat`.             |
| `SplatOptions`   | `@neostd/args/splat` | Options for `splat`.                    |

## Splitting

`split` handles common shell-like quoting and escaping rules without invoking a shell.

```ts
import { split } from "@neostd/args/split";

split("deno run --allow-read mod.ts");
// ["deno", "run", "--allow-read", "mod.ts"]

split('ls -la "my documents"');
// ["ls", "-la", "my documents"]

split("grep 'hello world' file.txt");
// ["grep", "hello world", "file.txt"]
```

## Joining

`join` uses the current platform. Use `unixJoin` or `windowsJoin` when you need deterministic quoting for a target shell.

```ts
import { join, unixJoin, windowsJoin } from "@neostd/args/join";

join(["git", "commit", "-m", "initial commit"]);
// git commit -m "initial commit"

unixJoin(["echo", "$HOME"]);
// echo "\$HOME"

windowsJoin(["cmd", "C:\\Program Files\\app.exe"]);
// cmd "C:\Program Files\app.exe"
```

## Splatting

`splat` is useful for constructing commands from structured data. Boolean `true` values become flags, `false` values
become `--no-name`, arrays repeat options, and positional values can be emitted with `"*"` or symbols.

```ts
import { splat, SplatSymbols } from "@neostd/args/splat";

splat({ all: true, output: "dist/app.js", "*": ["build"] });
// ["build", "--all", "--output", "dist/app.js"]

splat({ [SplatSymbols.command]: "git clone", depth: 1, branch: "main" });
// ["git", "clone", "--depth", "1", "--branch", "main"]

splat({ tag: ["v1", "latest"], "--": ["--raw"] });
// ["--tag", "v1", "--tag", "latest", "--", "--raw"]
```

## Parsing

`parse` produces a minimist-style object. Positionals are stored in `_`, repeated options become arrays, valueless
options become booleans, and `--no-name` becomes `{ name: false }`.

```ts
import { parse } from "@neostd/args/parse";

parse(["--name", "neo", "--count=2", "-v", "input.txt"], { boolean: ["v"] });
// { _: ["input.txt"], name: "neo", count: 2, v: true }

parse(["-n", "neo"], { alias: { name: "n" }, default: { color: "blue" } });
// { _: [], name: "neo", n: "neo", color: "blue" }

parse(["--id", "001", "--", "--not-parsed"], { string: ["id"], "--": true });
// { _: [], id: "001", "--": ["--not-parsed"] }
```

When called with no arguments, `parse()` reads current runtime args.

```ts
import { parse } from "@neostd/args";

const args = parse();
```

## Runtime Notes

The utilities are runtime-neutral. `parse()` defaults to `Deno.args` in Deno and `process.argv.slice(2)` in Node and
Bun. Bun also exposes `Bun.argv`, but it mirrors `process.argv` for this use case, so no Bun-specific API is needed.

## License

[MIT License](./LICENSE.md)
