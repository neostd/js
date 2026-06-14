# @neostd/is-elevated

## Overview

`@neostd/is-elevated` detects whether the current process is running with elevated privileges.
On Unix-like systems this typically means root. On Windows it checks whether the current token is elevated.

![logo](https://raw.githubusercontent.com/neostd/js/refs/heads/dev/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@neostd/is-elevated)](https://jsr.io/@neostd/is-elevated)
[![npm version](https://badge.fury.io/js/@neostd%2Fis-elevated.svg)](https://badge.fury.io/js/@neostd%2Fis-elevated)
[![GitHub version](https://badge.fury.io/gh/neostd%2Fjs.svg)](https://badge.fury.io/gh/neostd%2Fjs)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@neostd/is-elevated/doc).

A list of other modules can be found at [github.com/neostd/js](https://github.com/neostd/js).

## Installation

```bash
# Deno
deno add jsr:@neostd/is-elevated

# npm from jsr
npx jsr add @neostd/is-elevated

# from npmjs.org
npm install @neostd/is-elevated
```

## Usage

```typescript
import { isElevated } from "@neostd/is-elevated";

if (!isElevated()) {
  throw new Error("Run this as admin/root");
}
```

## Exports

| Export       | Subpath               | Description                                      |
| ------------ | --------------------- | ------------------------------------------------ |
| `isElevated` | `@neostd/is-elevated` | Detects whether the current process is elevated. |

```typescript
import { isElevated } from "@neostd/is-elevated";

const elevated = isElevated();

if (elevated) {
  console.log("ready for privileged work");
}
```

## Runtime Notes

Node.js uses either `node:ffi` or the optional `koffi` peer dependency when available. Bun and Deno use their native FFI support.
Tests for OS-specific behavior are skipped when the current runtime does not support the required platform semantics.

## License

[MIT License](./LICENSE.md)
