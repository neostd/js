//#region src/index.d.ts
/**
 * ## Overview
 *
 * The `@neostd/results` module provides the `Result<T, E>` type with functions `ok`, `fail`,
 * `tryCatch`, and `tryCatchAsync` to help deal with returning results or errors.
 *
 * ## Usage
 *
 * ```ts
 * import { fail, ok, tryCatch } from "@neostd/results";
 *
 * const r = ok(10);
 * console.log(r.ok);
 * console.log(r.failed);
 * console.log(r.map((v) => v.toString()));
 *
 * const r1 = tryCatch<number>(() => {
 *   throw new Error("test");
 * });
 *
 * console.log(r1.failed);
 *
 * const r2 = fail<number>(new Error("test"));
 * console.log(r2.failed);
 * ```
 *
 * @module
 */
type State = 0 | 1;
/** Represents an error that occurred while processing a result. */
declare class ResultError extends Error {
  constructor(message?: string, options?: ErrorOptions);
}
/** Represents a result that can either be a value of type `T` or an error of type `E`. */
declare class Result<T, E = Error> {
  #private;
  constructor(value?: T, error?: E, state?: State);
  get ok(): boolean;
  get failed(): boolean;
  get value(): T | undefined;
  get error(): E | undefined;
  and<U>(other: Result<U, E> | U): Result<U, E>;
  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E>;
  or(other: Result<T, E> | T): Result<T, E>;
  orElse(fn: (error: E) => Result<T, E>): Result<T, E>;
  test(fn: (value: T) => boolean): boolean;
  testError(fn: (error: E) => boolean): boolean;
  match<U>(ok: (value: T) => U, err: (error: E) => U): U;
  toArray(): T[];
  toIterable(): Iterable<T>;
  resolve(): Promise<T>;
  orThrow(): T;
  orDefault(defaultValue: T | (() => T)): T;
  orRequireError(): E;
  orDefaultError(defaultValue: E | (() => E)): E;
  inspect(fn: (value: T) => void): Result<T, E>;
  expect(message: string): T;
  expectError(message: string): E;
  mapValue<U>(fn: (value: T) => U, factory: U | (() => U)): U;
  map<U = T, F = E>(fn: (value: T) => U, mapError?: (error: E) => F): Result<U, F>;
  mapError<F>(fn: (error: E) => F, factory: F | (() => F)): F;
}
/** Represents a successful result with a value of type `T`. */
declare class Ok<T> extends Result<T, never> {
  constructor(value: T);
}
declare class EmptyResult extends Result<void, never> {
  constructor();
}
/** Represents an error result with an error of type `E`. */
declare class Failure<E = Error> extends Result<never, E> {
  constructor(error: E);
}
declare function ok<T, E>(value: T): Result<T, E>;
declare function empty(): EmptyResult;
declare function fail<T = never, E = Error>(error: E): Result<T, E>;
declare function failAsError<T = unknown>(error: unknown): Result<T>;
declare function match<T, E, U>(result: Result<T, E>, ok: (value: T) => U, err: (error: E) => U): U;
declare function voided(): Result<void>;
declare function tryCatch<T>(fn: () => T): Result<T, Error>;
declare function tryCatchAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>>;
//#endregion
export {
  EmptyResult,
  Failure,
  Ok,
  Result,
  ResultError,
  empty,
  fail,
  failAsError,
  match,
  ok,
  tryCatch,
  tryCatchAsync,
  voided,
};
