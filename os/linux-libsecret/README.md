# @neostd/linux-libsecret

## Overview

`@neostd/linux-libsecret` provides simple Linux secret storage access backed by `libsecret` FFI.

![logo](https://raw.githubusercontent.com/neostd/js/refs/heads/dev/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@neostd/linux-libsecret)](https://jsr.io/@neostd/linux-libsecret)
[![npm version](https://badge.fury.io/js/@neostd%2Flinux-libsecret.svg)](https://badge.fury.io/js/@neostd%2Flinux-libsecret)
[![GitHub version](https://badge.fury.io/gh/neostd%2Fjs.svg)](https://badge.fury.io/gh/neostd%2Fjs)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@neostd/linux-libsecret/doc).

A list of other modules can be found at [github.com/neostd/js](https://github.com/neostd/js).

## Installation

```bash
# Deno
deno add jsr:@neostd/linux-libsecret

# npm from jsr
npx jsr add @neostd/linux-libsecret

# from npmjs.org
npm install @neostd/linux-libsecret
```

## Usage

```typescript
import { isLinuxLibsecretAvailable, saveSecret } from "@neostd/linux-libsecret";

if (isLinuxLibsecretAvailable()) {
  saveSecret("my-service", "my-account", "my-secret");
}
```

## Examples

Write a secret:

```typescript
import { saveSecret } from "@neostd/linux-libsecret";

saveSecret("my-service", "my-account", "my-secret");
```

Read a secret:

```typescript
import { readSecret } from "@neostd/linux-libsecret";

console.log(readSecret("my-service", "my-account"));
```

Read raw bytes:

```typescript
import { getSecretBytes } from "@neostd/linux-libsecret";

console.log(getSecretBytes("my-service", "my-account"));
```

Delete a secret:

```typescript
import { removeSecret } from "@neostd/linux-libsecret";

removeSecret("my-service", "my-account");
```

List secrets for a service:

```typescript
import { listSecrets } from "@neostd/linux-libsecret";

console.log(listSecrets("my-service"));
```

## Exports

| Export                                                                                                   | Subpath                   | Description                               |
| -------------------------------------------------------------------------------------------------------- | ------------------------- | ----------------------------------------- |
| `readSecret`, `getSecretBytes`, `saveSecret`, `removeSecret`, `listSecrets`, `isLinuxLibsecretAvailable` | `@neostd/linux-libsecret` | libsecret helpers and availability check. |
| `SecretRecord`                                                                                           | `@neostd/linux-libsecret` | libsecret list record type.               |

## Runtime Notes

This package is Linux-specific. On non-Linux runtimes `isLinuxLibsecretAvailable()` returns `false`.

Node prefers `node:ffi` and falls back to the optional `koffi` peer dependency. Bun and Deno use their native FFI support.

## License

[MIT License](./LICENSE.md)
