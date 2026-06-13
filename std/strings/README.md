# @neostd/strings

## Overview

`@neostd/strings` provides cross-runtime string utilities for comparison,
case conversion, inflection, validation, trimming, conversion, splitting, and
string building.

Most comparison and transformation functions are string wrappers over
`@neostd/slices`, so they can share the same Unicode-aware character handling
while returning regular JavaScript strings.

The case-insensitive functions end with `Fold`. They use the same simple-fold
comparison model as `@neostd/chars` and `@neostd/slices`.

![logo](https://raw.githubusercontent.com/neostd/js/refs/heads/dev/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@neostd/strings)](https://jsr.io/@neostd/strings)
[![npm version](https://badge.fury.io/js/@neostd%2Fstrings.svg)](https://badge.fury.io/js/@neostd%2Fstrings)
[![GitHub version](https://badge.fury.io/gh/neostd%2Fjs.svg)](https://badge.fury.io/gh/neostd%2Fjs)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@neostd/strings/doc).

A list of other modules can be found at [github.com/neostd/js](https://github.com/neostd/js).

## Installation

```bash
# Deno
deno add jsr:@neostd/strings

# npm from jsr
npx jsr add @neostd/strings

# from npmjs.org
npm install @neostd/strings
```

## Usage

```typescript
import * as strings from "@neostd/strings";

strings.equalFold("Hello World", "hello world"); // true
strings.camelize("hello_world"); // "helloWorld"
strings.pluralize("person"); // "people"
strings.isNullOrSpace("   "); // true
strings.trimEnd("file.txt...", "."); // "file.txt"
```

## Classes

| Export          | Subpath                          | Description                                                              |
| --------------- | -------------------------------- | ------------------------------------------------------------------------ |
| `StringBuilder` | `@neostd/strings/string-builder` | A string builder that inherits `CharArrayBuilder` from `@neostd/slices`. |

```typescript
import { StringBuilder } from "@neostd/strings";

const builder = new StringBuilder();
builder.append("Hello").append(" ").append("World");
builder.toString(); // "Hello World"
builder.length; // 11
```

## Functions

### Case Conversion

| Export       | Subpath                      | Description                                              |
| ------------ | ---------------------------- | -------------------------------------------------------- |
| `camelize`   | `@neostd/strings/camelize`   | Converts a string to camel case.                         |
| `capitalize` | `@neostd/strings/capitalize` | Capitalizes the first character and lowercases the rest. |
| `dasherize`  | `@neostd/strings/dasherize`  | Converts a string to dash-separated kebab case.          |
| `pascalize`  | `@neostd/strings/pascalize`  | Converts a string to PascalCase.                         |
| `titleize`   | `@neostd/strings/titleize`   | Converts a string to title case.                         |
| `underscore` | `@neostd/strings/underscore` | Converts a string to underscore-separated snake case.    |

```typescript
import { camelize, capitalize, dasherize, pascalize, titleize, underscore } from "@neostd/strings";

camelize("hello_world"); // "helloWorld"
camelize("hello WORLD", { preserveCase: true }); // "helloWORLD"
capitalize("HELLO WORLD"); // "Hello world"
dasherize("helloWorld"); // "hello-world"
pascalize("hello world"); // "HelloWorld"
titleize("hello_world"); // "Hello World"
underscore("helloWorld", { screaming: true }); // "HELLO_WORLD"
```

### Comparison And Search

| Export            | Subpath                         | Description                                                                        |
| ----------------- | ------------------------------- | ---------------------------------------------------------------------------------- |
| `equal`           | `@neostd/strings/equal`         | Compares a string with another character buffer using case-sensitive comparison.   |
| `equalFold`       | `@neostd/strings/equal`         | Compares a string with another character buffer using case-insensitive comparison. |
| `startsWith`      | `@neostd/strings/starts-with`   | Checks whether a string starts with a prefix.                                      |
| `startsWithFold`  | `@neostd/strings/starts-with`   | Checks whether a string starts with a prefix using case-insensitive comparison.    |
| `endsWith`        | `@neostd/strings/ends-with`     | Checks whether a string ends with a suffix.                                        |
| `endsWithFold`    | `@neostd/strings/ends-with`     | Checks whether a string ends with a suffix using case-insensitive comparison.      |
| `indexOf`         | `@neostd/strings/index-of`      | Finds the first index of a character buffer.                                       |
| `indexOfFold`     | `@neostd/strings/index-of`      | Finds the first index of a character buffer using case-insensitive comparison.     |
| `lastIndexOf`     | `@neostd/strings/last-index-of` | Finds the last index of a character buffer.                                        |
| `lastIndexOfFold` | `@neostd/strings/last-index-of` | Finds the last index of a character buffer using case-insensitive comparison.      |

```typescript
import {
  endsWith,
  endsWithFold,
  equal,
  equalFold,
  indexOf,
  indexOfFold,
  lastIndexOf,
  lastIndexOfFold,
  startsWith,
  startsWithFold,
} from "@neostd/strings";

equal("Hello", "Hello"); // true
equalFold("Hello", "hello"); // true
startsWith("Hello World", "Hello"); // true
startsWithFold("Hello World", "hello"); // true
endsWith("Hello World", "World"); // true
endsWithFold("Hello World", "WORLD"); // true
indexOf("Hello World", "World"); // 6
indexOfFold("Hello World", "world"); // 6
lastIndexOf("hello world", "o"); // 7
lastIndexOfFold("Hello WORLD", "O"); // 7
```

### Inflection

| Export        | Subpath                   | Description                                                  |
| ------------- | ------------------------- | ------------------------------------------------------------ |
| `pluralize`   | `@neostd/strings/inflect` | Converts a singular English noun to its plural form.         |
| `singularize` | `@neostd/strings/inflect` | Converts a plural English noun to its singular form.         |
| `inflect`     | `@neostd/strings/inflect` | Converts a word to singular or plural form based on a count. |

```typescript
import { inflect, pluralize, singularize } from "@neostd/strings";

pluralize("person"); // "people"
pluralize("person", "folks"); // "folks"
singularize("people"); // "person"
singularize("people", "human"); // "human"
inflect("people", 1); // "person"
inflect("person", 2); // "people"
```

### Validation

| Export          | Subpath                        | Description                                                           |
| --------------- | ------------------------------ | --------------------------------------------------------------------- |
| `isEmpty`       | `@neostd/strings/is-empty`     | Checks whether a string is empty.                                     |
| `isNullOrEmpty` | `@neostd/strings/is-empty`     | Checks whether a value is null, undefined, or an empty string.        |
| `isNull`        | `@neostd/strings/is-null`      | Checks whether a value is null.                                       |
| `isSpace`       | `@neostd/strings/is-space`     | Checks whether every character in a string is whitespace.             |
| `isNullOrSpace` | `@neostd/strings/is-space`     | Checks whether a value is null, undefined, empty, or only whitespace. |
| `isUndefined`   | `@neostd/strings/is-undefined` | Checks whether a value is undefined.                                  |

```typescript
import {
  isEmpty,
  isNull,
  isNullOrEmpty,
  isNullOrSpace,
  isSpace,
  isUndefined,
} from "@neostd/strings";

isEmpty(""); // true
isNullOrEmpty(null); // true
isNull(null); // true
isSpace(" \t\n"); // true
isNullOrSpace("   "); // true
isUndefined(undefined); // true
```

### Trimming

| Export           | Subpath                | Description                                                       |
| ---------------- | ---------------------- | ----------------------------------------------------------------- |
| `trim`           | `@neostd/strings/trim` | Trims whitespace or custom characters from both ends of a string. |
| `trimStart`      | `@neostd/strings/trim` | Trims leading whitespace or custom characters from a string.      |
| `trimEnd`        | `@neostd/strings/trim` | Trims trailing whitespace or custom characters from a string.     |
| `trimChar`       | `@neostd/strings/trim` | Trims a single leading and trailing character by code point.      |
| `trimStartChar`  | `@neostd/strings/trim` | Trims a single leading character by code point.                   |
| `trimEndChar`    | `@neostd/strings/trim` | Trims a single trailing character by code point.                  |
| `trimSlice`      | `@neostd/strings/trim` | Trims a leading and trailing character sequence.                  |
| `trimStartSlice` | `@neostd/strings/trim` | Trims a leading character sequence.                               |
| `trimEndSlice`   | `@neostd/strings/trim` | Trims a trailing character sequence.                              |

```typescript
import {
  trim,
  trimChar,
  trimEnd,
  trimEndChar,
  trimEndSlice,
  trimSlice,
  trimStart,
  trimStartChar,
  trimStartSlice,
} from "@neostd/strings";

trim("  hello  "); // "hello"
trim("##hello##", "#"); // "hello"
trimStart("///hello", "/"); // "hello"
trimEnd("hello...", "."); // "hello"
trimChar(".hello.", 46); // "hello"
trimStartChar(".hello", 46); // "hello"
trimEndChar("hello.", 46); // "hello"
trimSlice("123hello123", [49, 50, 51]); // "hello"
trimStartSlice("123hello", [49, 50, 51]); // "hello"
trimEndSlice("hello123", [49, 50, 51]); // "hello"
```

### Conversion And Splitting

| Export        | Subpath                         | Description                                                             |
| ------------- | ------------------------------- | ----------------------------------------------------------------------- |
| `split`       | `@neostd/strings/split`         | Splits a string, UTF-8 byte array, or code-point array into substrings. |
| `toCharArray` | `@neostd/strings/to-char-array` | Converts a string to a `Uint32Array` of Unicode code points.            |
| `toString`    | `@neostd/strings/to-char-array` | Converts a character buffer to a string.                                |

```typescript
import { split, toCharArray, toString } from "@neostd/strings";

split("a,b,c", ","); // ["a", "b", "c"]
split(" a , b , ", ",", true); // ["a", "b"]
[...toCharArray("abc")]; // [97, 98, 99]
toString([97, 98, 99]); // "abc"
```

## Character Buffers

Many functions accept `CharBuffer` values from `@neostd/slices`, including strings,
`Uint32Array`, `Uint16Array`, `Uint8Array`, and slice-like character sequences.

```typescript
import { equal, toCharArray } from "@neostd/strings";

equal("abc", toCharArray("abc")); // true
```

## License

[MIT License](./LICENSE.md)

Pluralize and singularize include code from
[dreamerslab/node.inflection](https://github.com/dreamerslab/node.inflection) under the
[MIT License](https://github.com/dreamerslab/node.inflection/blob/master/LICENSE).
