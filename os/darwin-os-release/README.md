# @neostd/darwin-os-release

## Overview

`@neostd/darwin-os-release` provides cross-runtime macOS release detection by reading `SystemVersion.plist`.
It exposes parsed release metadata, raw `os-release`-style text, and convenience accessors for product name, version, build, and codename.

![logo](https://raw.githubusercontent.com/neostd/js/refs/heads/dev/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@neostd/darwin-os-release)](https://jsr.io/@neostd/darwin-os-release)
[![npm version](https://badge.fury.io/js/@neostd%2Fdarwin-os-release.svg)](https://badge.fury.io/js/@neostd%2Fdarwin-os-release)
[![GitHub version](https://badge.fury.io/gh/neostd%2Fjs.svg)](https://badge.fury.io/gh/neostd%2Fjs)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@neostd/darwin-os-release/doc).

A list of other modules can be found at [github.com/neostd/js](https://github.com/neostd/js).

## Installation

```bash
# Deno
deno add jsr:@neostd/darwin-os-release

# npm from jsr
npx jsr add @neostd/darwin-os-release

# from npmjs.org
npm install @neostd/darwin-os-release
```

## Usage

```typescript
import { getMacOsRelease, isDarwinOsReleaseAvailable } from "@neostd/darwin-os-release";

if (isDarwinOsReleaseAvailable()) {
  console.log(getMacOsRelease().prettyName);
}
```

## Examples

Read basic version fields:

```typescript
import {
  getBuildVersion,
  getProductName,
  getProductVersion,
  getVersionCodename,
} from "@neostd/darwin-os-release";

console.log(getProductName());
console.log(getProductVersion());
console.log(getBuildVersion());
console.log(getVersionCodename());
```

Read structured release data:

```typescript
import { getMacOsRelease } from "@neostd/darwin-os-release";

const release = getMacOsRelease();

console.log(release.prettyName);
console.log(release.buildId);
```

Build `os-release` text:

```typescript
import { getMacOsReleaseText } from "@neostd/darwin-os-release";

console.log(getMacOsReleaseText());
```

## Exports

| Export                                                                                                                                                 | Subpath                     | Description                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- | --------------------------------------------- |
| `getMacOsRelease`, `getMacOsReleaseText`, `getProductName`, `getProductVersion`, `getBuildVersion`, `getVersionCodename`, `isDarwinOsReleaseAvailable` | `@neostd/darwin-os-release` | macOS release helpers and availability check. |
| `OsRelease`                                                                                                                                            | `@neostd/darwin-os-release` | Parsed macOS release type.                    |

## Runtime Notes

This package is macOS-specific. On non-macOS runtimes `isDarwinOsReleaseAvailable()` returns `false` and runtime accessors throw when called.

## License

[MIT License](./LICENSE.md)
