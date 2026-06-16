# @neostd/win-os-release

## Overview

`@neostd/win-os-release` provides cross-runtime helpers for detecting Windows version, edition, server/workstation role, domain role, and `os-release`-style metadata.

![logo](https://raw.githubusercontent.com/neostd/js/refs/heads/dev/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@neostd/win-os-release)](https://jsr.io/@neostd/win-os-release)
[![npm version](https://badge.fury.io/js/@neostd%2Fwin-os-release.svg)](https://badge.fury.io/js/@neostd%2Fwin-os-release)
[![GitHub version](https://badge.fury.io/gh/neostd%2Fjs.svg)](https://badge.fury.io/gh/neostd%2Fjs)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@neostd/win-os-release/doc).

A list of other modules can be found at [github.com/neostd/js](https://github.com/neostd/js).

## Installation

```bash
# Deno
deno add jsr:@neostd/win-os-release

# npm from jsr
npx jsr add @neostd/win-os-release

# from npmjs.org
npm install @neostd/win-os-release
```

## Usage

```typescript
import { getWindowsOsRelease, isAvailable } from "@neostd/win-os-release";

if (isAvailable()) {
  const info = getWindowsOsRelease();
  console.log(info.displayName);
}
```

## Examples

Read Windows release information:

```typescript
import { getWindowsOsRelease } from "@neostd/win-os-release";

const info = getWindowsOsRelease();

console.log(info.displayName);
console.log(info.isServer);
```

Read raw Windows version details:

```typescript
import { getWindowsVersion } from "@neostd/win-os-release";

const version = getWindowsVersion();

console.log(version.majorVersion, version.minorVersion, version.buildNumber);
```

Read domain role information:

```typescript
import { getWindowsDomainInfo, isWindowsDomainJoined } from "@neostd/win-os-release";

const domain = getWindowsDomainInfo();

console.log(domain.machineRole);
console.log(isWindowsDomainJoined(domain));
```

Build `os-release` text:

```typescript
import { getWindowsOsReleaseText } from "@neostd/win-os-release";

console.log(getWindowsOsReleaseText());
```

Build `os-release` JSON:

```typescript
import { getWindowsOsReleaseJson } from "@neostd/win-os-release";

console.log(getWindowsOsReleaseJson());
```

Check workstation/server role:

```typescript
import { getWindowsVersion, isWindowsServer, isWindowsWorkstation } from "@neostd/win-os-release";

const version = getWindowsVersion();

console.log(isWindowsServer(version));
console.log(isWindowsWorkstation(version));
```

## Exports

| Export                                                                                       | Subpath                             | Description                      |
| -------------------------------------------------------------------------------------------- | ----------------------------------- | -------------------------------- |
| Windows OS release helpers such as `getWindowsOsRelease`, `getWindowsVersion`, `isAvailable` | `@neostd/win-os-release`            | Root Windows release API.        |
| Same helpers as root                                                                         | `@neostd/win-os-release/os-release` | Explicit release helper subpath. |
| `ProductType`, `MachineRole`, `SuiteMask`, `ProductEdition`, and related types               | `@neostd/win-os-release/types`      | Constants and types.             |

## Runtime Notes

This package is Windows-specific. On non-Windows runtimes `isAvailable()` returns `false`, while the pure helper functions still return fallback structures when called directly.

Node.js uses either `node:ffi` or the optional `koffi` peer dependency. Bun and Deno use their native FFI support.

## License

[MIT License](./LICENSE.md)
