# @neostd/win-cred

## Overview

`@neostd/win-cred` provides cross-runtime access to Windows Credential Manager using runtime-specific FFI backends.
It supports reading, writing, listing, and deleting credentials on Windows from Node.js, Bun, and Deno.

![logo](https://raw.githubusercontent.com/neostd/js/refs/heads/dev/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@neostd/win-cred)](https://jsr.io/@neostd/win-cred)
[![npm version](https://badge.fury.io/js/@neostd%2Fwin-cred.svg)](https://badge.fury.io/js/@neostd%2Fwin-cred)
[![GitHub version](https://badge.fury.io/gh/neostd%2Fjs.svg)](https://badge.fury.io/gh/neostd%2Fjs)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@neostd/win-cred/doc).

A list of other modules can be found at [github.com/neostd/js](https://github.com/neostd/js).

## Installation

```bash
# Deno
deno add jsr:@neostd/win-cred

# npm from jsr
npx jsr add @neostd/win-cred

# from npmjs.org
npm install @neostd/win-cred
```

## Usage

```typescript
import { readSecret, saveCredential } from "@neostd/win-cred";

saveCredential({ targetName: "myapp/token", secret: "secret" });
console.log(readSecret("myapp/token"));
```

## Examples

Write a generic credential:

```typescript
import { CredPersist, CredType, saveCredential } from "@neostd/win-cred";

saveCredential({
  targetName: "myapp/token",
  secret: "secret",
  type: CredType.GENERIC,
  persist: CredPersist.LOCAL_MACHINE,
  userName: "neo",
});
```

Read a credential object:

```typescript
import { readCredential } from "@neostd/win-cred";

const credential = readCredential("myapp/token");

console.log(credential?.targetName);
console.log(credential?.userName);
```

Read and decode a secret string:

```typescript
import { readSecret } from "@neostd/win-cred";

console.log(readSecret("myapp/token"));
```

List credentials:

```typescript
import { listCredentials } from "@neostd/win-cred";

for (const credential of listCredentials()) {
  console.log(credential.targetName);
}
```

Delete a credential:

```typescript
import { removeCredential } from "@neostd/win-cred";

removeCredential("myapp/token");
```

Encode and decode secret blobs manually:

```typescript
import { decodeSecret, encodeSecret } from "@neostd/win-cred";

const blob = encodeSecret("secret");
console.log(decodeSecret(blob));
```

## Exports

| Export                                                                                                                                 | Subpath                       | Description                         |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ----------------------------------- |
| `saveCredential`, `readCredential`, `readSecret`, `removeCredential`, `listCredentials`, `encodeSecret`, `decodeSecret`, `isAvailable` | `@neostd/win-cred`            | High-level credential helpers.      |
| Same as root, plus `WriteOptions`                                                                                                      | `@neostd/win-cred/credential` | Explicit credential helper subpath. |
| `CredType`, `CredPersist`, `CredWriteFlags`, `CredEnumerateFlags`, types                                                               | `@neostd/win-cred/types`      | Credential constants and types.     |

## Runtime Notes

This package is Windows-specific. On non-Windows runtimes `isAvailable()` returns `false`, read operations return empty results, and mutation helpers are not supported.

Node.js uses either `node:ffi` or the optional `koffi` peer dependency. Bun and Deno use their native FFI support.

## License

[MIT License](./LICENSE.md)
