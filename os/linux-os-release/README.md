# @neostd/linux-os-release

## Overview

`@neostd/linux-os-release` provides cross-runtime Linux release detection by reading and parsing `/etc/os-release`.
It exposes parsed release metadata, raw `os-release` text, and convenience accessors for distribution identity and version information.

![logo](https://raw.githubusercontent.com/neostd/js/refs/heads/dev/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@neostd/linux-os-release)](https://jsr.io/@neostd/linux-os-release)
[![npm version](https://badge.fury.io/js/@neostd%2Flinux-os-release.svg)](https://badge.fury.io/js/@neostd%2Flinux-os-release)
[![GitHub version](https://badge.fury.io/gh/neostd%2Fjs.svg)](https://badge.fury.io/gh/neostd%2Fjs)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@neostd/linux-os-release/doc).

A list of other modules can be found at [github.com/neostd/js](https://github.com/neostd/js).

## Installation

```bash
# Deno
deno add jsr:@neostd/linux-os-release

# npm from jsr
npx jsr add @neostd/linux-os-release

# from npmjs.org
npm install @neostd/linux-os-release
```

## Usage

```typescript
import { getPrettyName, isLinuxOsReleaseAvailable } from "@neostd/linux-os-release";

if (isLinuxOsReleaseAvailable()) {
  console.log(getPrettyName());
}
```

## Examples

Read basic release fields:

```typescript
import { getId, getPrettyName, getVersionCodename } from "@neostd/linux-os-release";

console.log(getId());
console.log(getPrettyName());
console.log(getVersionCodename());
```

Read structured release data:

```typescript
import { getLinuxOsRelease } from "@neostd/linux-os-release";

const release = getLinuxOsRelease();

console.log(release.id, release.versionId);
```

Read raw `/etc/os-release` text:

```typescript
import { getLinuxOsReleaseText } from "@neostd/linux-os-release";

console.log(getLinuxOsReleaseText());
```

Check distribution family:

```typescript
import { isLike } from "@neostd/linux-os-release";

console.log(isLike("debian"));
```

## Exports

| Export                                                                                                                                                                                                                  | Subpath                    | Description                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | --------------------------------------------- |
| `getLinuxOsRelease`, `getLinuxOsReleaseText`, `getId`, `getIdLike`, `getName`, `getPrettyName`, `getVersion`, `getVersionId`, `getVersionCodename`, `getVariant`, `getVariantId`, `isLike`, `isLinuxOsReleaseAvailable` | `@neostd/linux-os-release` | Linux release helpers and availability check. |
| `OsRelease`                                                                                                                                                                                                             | `@neostd/linux-os-release` | Parsed Linux release type.                    |

## Runtime Notes

This package is Linux-specific. On non-Linux runtimes `isLinuxOsReleaseAvailable()` returns `false` and runtime accessors throw when called.

## License

[MIT License](./LICENSE.md)
