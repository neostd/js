# @neostd/results

## Overview

`@neostd/results` provides a small `Result<T, E>` abstraction for returning success and failure values without throwing.
It includes helpers for composition, fallback handling, pattern matching, and exception capture across sync and async code.

![logo](https://raw.githubusercontent.com/neostd/js/refs/heads/dev/eng/assets/logo.png)

[![JSR](https://jsr.io/badges/@neostd/results)](https://jsr.io/@neostd/results)
[![npm version](https://badge.fury.io/js/@neostd%2Fresults.svg)](https://badge.fury.io/js/@neostd%2Fresults)
[![GitHub version](https://badge.fury.io/gh/neostd%2Fjs.svg)](https://badge.fury.io/gh/neostd%2Fjs)

## Documentation

Documentation is available on [jsr.io](https://jsr.io/@neostd/results/doc).

A list of other modules can be found at [github.com/neostd/js](https://github.com/neostd/js).

## Installation

```bash
# Deno
deno add jsr:@neostd/results

# npm from jsr
npx jsr add @neostd/results

# from npmjs.org
npm install @neostd/results
```

## Usage

```typescript
import { fail, ok, tryCatch, tryCatchAsync } from "@neostd/results";

const count = ok(42);
const fallback = fail<number>(new Error("nope"));

count.map((value) => value + 1).orThrow(); // 43
fallback.orDefault(0); // 0

const parsed = tryCatch(() => JSON.parse('{"name":"neo"}') as { name: string });
const loaded = await tryCatchAsync(async () => ({ id: 1 }));

parsed.match(
  (value) => value.name,
  (error) => error.message,
);

loaded.ok; // true
```

## Exports

| Export                                                  | Subpath                  | Description                                                |
| ------------------------------------------------------- | ------------------------ | ---------------------------------------------------------- |
| `Result`, `Ok`, `Failure`, `EmptyResult`, `ResultError` | `@neostd/results`        | Result types and error class.                              |
| `ok`, `empty`, `fail`, `failAsError`                    | `@neostd/results`        | Create success, empty, and failure results.                |
| `match`                                                 | `@neostd/results`        | Match a result with success and failure handlers.          |
| `tryCatch`, `tryCatchAsync`                             | `@neostd/results`        | Convert thrown sync or async errors into `Result` values.  |
| Full root re-export                                     | `@neostd/results/result` | Alias of the root module for explicit result-only imports. |

```typescript
import { fail, match, ok, tryCatch } from "@neostd/results";

const value = tryCatch(() => Number.parseInt("12", 10));

const label = match(
  value.map((result) => result * 2),
  (result) => `ok:${result}`,
  (error) => `error:${error.message}`,
);

const next = ok(2)
  .andThen((result) => ok(result + 1))
  .orElse(() => fail(new Error("unreachable")));

label; // "ok:24"
next.value; // 3
```

## Result API

`Result` instances expose helpers for composition and unwrapping:

| Method                                                     |
| ---------------------------------------------------------- |
| `and`, `andThen`                                           |
| `or`, `orElse`                                             |
| `map`, `mapValue`, `mapError`                              |
| `match`, `test`, `testError`                               |
| `inspect`                                                  |
| `toArray`, `toIterable`, `resolve`                         |
| `orThrow`, `orDefault`, `orRequireError`, `orDefaultError` |
| `expect`, `expectError`                                    |

```typescript
import { fail, ok } from "@neostd/results";

const a = ok("neo")
  .map((value) => value.toUpperCase())
  .andThen((value) => ok(`${value}!`));

const b = fail<string, Error>(new Error("missing"))
  .orElse((error) => ok(error.message))
  .orThrow();

a.value; // "NEO!"
b; // "missing"
```

## Notes

`Result<T, E>` is useful when you want explicit success and failure handling without exceptions controlling normal flow.
Use `tryCatch()` and `tryCatchAsync()` at boundaries where exceptions can still occur.

## License

[MIT License](./LICENSE.md)
