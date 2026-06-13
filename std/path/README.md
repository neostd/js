# @neostd/path

## Overview

`@neostd/path` provides cross-runtime utilities for working with POSIX,
Windows, and current-runtime file paths. It is based on Deno `@std/path` and
`path-browserify`, with runtime shims so the same module works in Node, Bun,
Deno, and browser-like runtimes.

Use the root module for current-runtime behavior, `@neostd/path/posix` for
POSIX-specific behavior, and `@neostd/path/windows` for Windows-specific
behavior.

![logo](https://raw.githubusercontent.com/neostd/js/refs/heads/dev/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@neostd/path)](https://jsr.io/@neostd/path)
[![npm version](https://badge.fury.io/js/@neostd%2Fpath.svg)](https://badge.fury.io/js/@neostd%2Fpath)
[![GitHub version](https://badge.fury.io/gh/neostd%2Fjs.svg)](https://badge.fury.io/gh/neostd%2Fjs)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@neostd/path/doc).

A list of other modules can be found at [github.com/neostd/js](https://github.com/neostd/js).

## Installation

```bash
# Deno
deno add jsr:@neostd/path

# npm from jsr
npx jsr add @neostd/path

# from npmjs.org
npm install @neostd/path
```

## Usage

```typescript
import { basename, dirname, isAbsolute, join, resolve } from "@neostd/path";

isAbsolute("./test"); // false

const dir = resolve("./test");
const file = join(dir, "text.txt");

dirname(file);
basename(file); // "text.txt"
```

## Root Exports

Root exports select POSIX or Windows behavior from the current runtime.

| Export             | Subpath                           | Description                                                  |
| ------------------ | --------------------------------- | ------------------------------------------------------------ |
| `basename`         | `@neostd/path/basename`           | Returns the last portion of a path.                          |
| `common`           | `@neostd/path/common`             | Returns the shared path prefix from a set of paths.          |
| `dirname`          | `@neostd/path/dirname`            | Returns the directory portion of a path.                     |
| `extname`          | `@neostd/path/extname`            | Returns the extension of a path, including the leading dot.  |
| `format`           | `@neostd/path/format`             | Creates a path string from a `ParsedPath` object.            |
| `fromFileUrl`      | `@neostd/path/from-file-url`      | Converts a file URL to a path string.                        |
| `globToRegExp`     | `@neostd/path/glob-to-regexp`     | Converts a glob string to a regular expression.              |
| `isAbsolute`       | `@neostd/path/is-absolute`        | Checks whether a path is absolute.                           |
| `isGlob`           | `@neostd/path/is-glob`            | Checks whether a string contains glob syntax.                |
| `join`             | `@neostd/path/join`               | Joins path segments and normalizes the result.               |
| `joinGlobs`        | `@neostd/path/join-globs`         | Joins glob segments and normalizes the result.               |
| `normalize`        | `@neostd/path/normalize`          | Normalizes a path by resolving `.` and `..` segments.        |
| `normalizeGlob`    | `@neostd/path/normalize-glob`     | Normalizes a glob string.                                    |
| `parse`            | `@neostd/path/parse`              | Parses a path string into a `ParsedPath` object.             |
| `relative`         | `@neostd/path/relative`           | Returns a relative path from one path to another.            |
| `resolve`          | `@neostd/path/resolve`            | Resolves path segments into an absolute path.                |
| `toFileUrl`        | `@neostd/path/to-file-url`        | Converts a path string to a file URL.                        |
| `toNamespacedPath` | `@neostd/path/to-namespaced-path` | Converts a Windows path to a namespace path; no-op on POSIX. |

```typescript
import {
  basename,
  common,
  dirname,
  extname,
  format,
  fromFileUrl,
  globToRegExp,
  isAbsolute,
  isGlob,
  join,
  joinGlobs,
  normalize,
  normalizeGlob,
  parse,
  relative,
  resolve,
  toFileUrl,
  toNamespacedPath,
} from "@neostd/path";

basename("/tmp/file.txt"); // "file.txt"
common(["/tmp/a", "/tmp/b"]); // "/tmp"
dirname("/tmp/file.txt"); // "/tmp"
extname("/tmp/file.txt"); // ".txt"
format({ dir: "/tmp", base: "file.txt" }); // "/tmp/file.txt"
fromFileUrl("file:///tmp/file.txt"); // "/tmp/file.txt" on POSIX
globToRegExp("**/*.ts", { globstar: true }).test("src/index.ts"); // true
isAbsolute("/tmp"); // true on POSIX
isGlob("**/*.ts"); // true
join("/tmp", "file.txt"); // "/tmp/file.txt" on POSIX
joinGlobs(["src", "**", "*.ts"], { globstar: true }); // "src/**/*.ts" on POSIX
normalize("/tmp/../tmp/file.txt"); // "/tmp/file.txt" on POSIX
normalizeGlob("foo/bar/../*", { globstar: true }); // "foo/*" on POSIX
parse("/tmp/file.txt").base; // "file.txt"
relative("/tmp/a", "/tmp/b"); // "../b" on POSIX
resolve("."); // current working directory
toFileUrl("/tmp/file.txt").href; // "file:///tmp/file.txt" on POSIX
toNamespacedPath("/tmp/file.txt"); // "/tmp/file.txt" on POSIX
```

## Constants And Types

| Export              | Subpath                       | Description                                              |
| ------------------- | ----------------------------- | -------------------------------------------------------- |
| `DELIMITER`         | `@neostd/path/constants`      | Current-runtime PATH environment delimiter.              |
| `SEPARATOR`         | `@neostd/path/constants`      | Current-runtime path separator.                          |
| `SEPARATOR_PATTERN` | `@neostd/path/constants`      | Current-runtime separator-matching regular expression.   |
| `GlobOptions`       | `@neostd/path/glob-to-regexp` | Options for glob conversion, joining, and normalization. |
| `ParsedPath`        | `@neostd/path/types`          | Parsed path object shape used by `parse` and `format`.   |

```typescript
import { DELIMITER, SEPARATOR, SEPARATOR_PATTERN } from "@neostd/path/constants";
import type { GlobOptions, ParsedPath } from "@neostd/path";

process.env.PATH?.split(DELIMITER);
["tmp", "file.txt"].join(SEPARATOR);
"tmp///file.txt".split(SEPARATOR_PATTERN);

const options: GlobOptions = { globstar: true };
const parsed: ParsedPath = { root: "/", dir: "/tmp", base: "file.txt", ext: ".txt", name: "file" };
```

## POSIX Exports

POSIX exports are available from `@neostd/path/posix` and from explicit subpaths.
They always use `/` separators regardless of the current runtime.

| Export                                        | Subpath                                 |
| --------------------------------------------- | --------------------------------------- |
| `basename`                                    | `@neostd/path/posix/basename`           |
| `common`                                      | `@neostd/path/posix/common`             |
| `DELIMITER`, `SEPARATOR`, `SEPARATOR_PATTERN` | `@neostd/path/posix/constants`          |
| `dirname`                                     | `@neostd/path/posix/dirname`            |
| `extname`                                     | `@neostd/path/posix/extname`            |
| `format`                                      | `@neostd/path/posix/format`             |
| `fromFileUrl`                                 | `@neostd/path/posix/from-file-url`      |
| `globToRegExp`                                | `@neostd/path/posix/glob-to-regexp`     |
| `isAbsolute`                                  | `@neostd/path/posix/is-absolute`        |
| `isGlob`                                      | `@neostd/path/posix/is-glob`            |
| `join`                                        | `@neostd/path/posix/join`               |
| `joinGlobs`                                   | `@neostd/path/posix/join-globs`         |
| `normalize`                                   | `@neostd/path/posix/normalize`          |
| `normalizeGlob`                               | `@neostd/path/posix/normalize-glob`     |
| `parse`                                       | `@neostd/path/posix/parse`              |
| `relative`                                    | `@neostd/path/posix/relative`           |
| `resolve`                                     | `@neostd/path/posix/resolve`            |
| `toFileUrl`                                   | `@neostd/path/posix/to-file-url`        |
| `toNamespacedPath`                            | `@neostd/path/posix/to-namespaced-path` |
| `ParsedPath`                                  | `@neostd/path/posix`                    |

```typescript
import * as posix from "@neostd/path/posix";

posix.join("/tmp", "file.txt"); // "/tmp/file.txt"
posix.relative("/tmp/a", "/tmp/b"); // "../b"
posix.toFileUrl("/tmp/file.txt").href; // "file:///tmp/file.txt"
```

## Windows Exports

Windows exports are available from `@neostd/path/windows` and from explicit
subpaths. They always use Windows path rules regardless of the current runtime.

| Export                                        | Subpath                                   |
| --------------------------------------------- | ----------------------------------------- |
| `basename`                                    | `@neostd/path/windows/basename`           |
| `common`                                      | `@neostd/path/windows/common`             |
| `DELIMITER`, `SEPARATOR`, `SEPARATOR_PATTERN` | `@neostd/path/windows/constants`          |
| `dirname`                                     | `@neostd/path/windows/dirname`            |
| `extname`                                     | `@neostd/path/windows/extname`            |
| `format`                                      | `@neostd/path/windows/format`             |
| `fromFileUrl`                                 | `@neostd/path/windows/from-file-url`      |
| `globToRegExp`                                | `@neostd/path/windows/glob-to-regexp`     |
| `isAbsolute`                                  | `@neostd/path/windows/is-absolute`        |
| `isGlob`                                      | `@neostd/path/windows/is-glob`            |
| `join`                                        | `@neostd/path/windows/join`               |
| `joinGlobs`                                   | `@neostd/path/windows/join-globs`         |
| `normalize`                                   | `@neostd/path/windows/normalize`          |
| `normalizeGlob`                               | `@neostd/path/windows/normalize-glob`     |
| `parse`                                       | `@neostd/path/windows/parse`              |
| `relative`                                    | `@neostd/path/windows/relative`           |
| `resolve`                                     | `@neostd/path/windows/resolve`            |
| `toFileUrl`                                   | `@neostd/path/windows/to-file-url`        |
| `toNamespacedPath`                            | `@neostd/path/windows/to-namespaced-path` |
| `ParsedPath`                                  | `@neostd/path/windows`                    |

```typescript
import * as windows from "@neostd/path/windows";

windows.join("C:\\tmp", "file.txt"); // "C:\\tmp\\file.txt"
windows.parse("C:\\tmp\\file.txt").root; // "C:\\"
windows.toNamespacedPath("C:\\tmp\\file.txt"); // "\\\\?\\C:\\tmp\\file.txt"
```

## Notes

`@neostd/path` repackages Deno `@std/path` to avoid runtime-specific package
shims when publishing `@neostd/*` modules to npm. It also includes URL helpers
such as `toFileUrl` and `fromFileUrl` that are not exposed by `node:path`.

## License

[MIT License](./LICENSE.md)

This package includes code from Deno `@std/path` and `path-browserify`; see
[`LICENSE.md`](./LICENSE.md) for full notices.
