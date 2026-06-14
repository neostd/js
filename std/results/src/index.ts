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

const States = {
  Ok: 0 as State,
  Err: 1 as State,
};

function stringify(value: unknown): string {
  return typeof value === "string" ? value : String(value);
}

/**
 * Error thrown by `Result` helpers when a caller asks for a value or error that
 * is not present.
 *
 * @param message The error message.
 * @param options Native error options, including `cause`.
 */
export class ResultError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message ?? "Result error.", options);
    this.name = "ResultError";
  }
}

/**
 * Represents a result that can either be a success value of type `T` or a
 * failure value of type `E`.
 *
 * @example Usage
 * ```ts
 * import { Result, fail, ok } from "@neostd/results";
 *
 * const success: Result<number, Error> = ok(2);
 * const failure: Result<number, Error> = fail(new Error("boom"));
 *
 * success.map((value) => value + 1).orThrow(); // 3
 * failure.orDefault(0); // 0
 * ```
 */
export class Result<T, E = Error> {
  #state: State;
  #value: T | undefined;
  #error: E | undefined;

  /**
   * Creates a result from a value or error.
   *
   * Prefer `ok()` and `fail()` for most callers.
   *
   * @param value The success value.
   * @param error The failure value.
   * @param state The explicit result state.
   * @throws ResultError If both value and error are provided for the same state.
   */
  constructor(value?: T, error?: E, state: State = error === undefined ? States.Ok : States.Err) {
    if (state === States.Ok && error !== undefined) {
      throw new ResultError("Result cannot have both value and error");
    }

    if (state === States.Err && value !== undefined) {
      throw new ResultError("Result cannot have both value and error");
    }

    this.#state = state;
    this.#value = value;
    this.#error = error;
  }

  /** Returns `true` when the result contains a success value. */
  get ok(): boolean {
    return this.#state === States.Ok;
  }

  /** Returns `true` when the result contains a failure value. */
  get failed(): boolean {
    return this.#state === States.Err;
  }

  /** Returns the success value when present, otherwise `undefined`. */
  get value(): T | undefined {
    return this.#value;
  }

  /** Returns the failure value when present, otherwise `undefined`. */
  get error(): E | undefined {
    return this.#error;
  }

  /**
   * Returns `other` when this result is ok, otherwise returns the current
   * failure.
   *
   * @param other The next result or raw value.
   * @returns `other` if this result is ok, otherwise the current failure.
   */
  and<U>(other: Result<U, E> | U): Result<U, E> {
    if (this.#state === States.Ok) {
      return other instanceof Result ? other : ok(other);
    }

    return new Result<U, E>(undefined, this.#error);
  }

  /**
   * Chains another result-producing operation when this result is ok.
   *
   * @param fn Function invoked with the current success value.
   * @returns The next result if this result is ok, otherwise the current failure.
   */
  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (this.#state === States.Err) {
      return new Result<U, E>(undefined, this.#error);
    }

    return fn(this.#value!);
  }

  /**
   * Returns this result when it is ok, otherwise returns `other`.
   *
   * @param other Fallback result or raw success value.
   * @returns This result when ok, otherwise `other` wrapped as a result.
   */
  or(other: Result<T, E> | T): Result<T, E> {
    if (this.#state === States.Ok) {
      return this;
    }

    return other instanceof Result ? other : ok(other);
  }

  /**
   * Recovers from a failure by mapping the error to another result.
   *
   * @param fn Function invoked with the current error.
   * @returns This result when ok, otherwise the recovery result.
   */
  orElse(fn: (error: E) => Result<T, E>): Result<T, E> {
    if (this.#state === States.Ok) {
      return this;
    }

    return fn(this.#error!);
  }

  /**
   * Tests the success value with a predicate.
   *
   * @param fn Predicate to evaluate when the result is ok.
   * @returns `true` when the result is ok and the predicate returns `true`.
   */
  test(fn: (value: T) => boolean): boolean {
    return this.#state === States.Ok ? fn(this.#value!) : false;
  }

  /**
   * Tests the failure value with a predicate.
   *
   * @param fn Predicate to evaluate when the result is a failure.
   * @returns `true` when the result is a failure and the predicate returns `true`.
   */
  testError(fn: (error: E) => boolean): boolean {
    return this.#state === States.Err ? fn(this.#error!) : false;
  }

  /**
   * Matches a result into a single output value.
   *
   * @param ok Called with the success value.
   * @param err Called with the failure value.
   * @returns The return value from the matching branch.
   */
  match<U>(ok: (value: T) => U, err: (error: E) => U): U {
    if (this.#state === States.Ok) {
      return ok(this.#value!);
    }

    return err(this.#error!);
  }

  /**
   * Converts the success value to a single-item array.
   *
   * @returns `[value]` for ok results, otherwise `[]`.
   */
  toArray(): T[] {
    return this.#state === States.Ok ? [this.#value!] : [];
  }

  /**
   * Converts the success value to an iterable sequence.
   *
   * @returns An iterable containing the success value, or empty when failed.
   */
  toIterable(): Iterable<T> {
    return this.#state === States.Ok ? [this.#value!] : [];
  }

  /**
   * Converts the result into a a resolved promise.
   *
   * @returns A resolved promise for ok results, or a rejected promise for failures.
   */
  resolve(): Promise<T> {
    return this.#state === States.Ok
      ? Promise.resolve<T>(this.#value!)
      : Promise.reject<T>(this.#error!);
  }

  /**
   * Converts the result into a promise.
   *
   * @returns A resolved promise for ok results, or a rejected promise for failures.
   * @param onFulfilled The callback invoked with the success value.
   * @param onRejected  The callback invoked with the failure error.
   * @returns A promise that resolves to the success value or failure error.
   */
  toPromise(onFulfilled?: (value: T) => T | PromiseLike<T>, onRejected?: (error: E) => E | PromiseLike<T>): Promise<T> {
     return new Promise<T>((resolve, reject) => {
       if (this.#state === States.Ok) {
         resolve(onFulfilled ? onFulfilled(this.#value!) : this.#value!);
         return;
       }

       reject(onRejected ? onRejected(this.#error!) : this.#error!);
     });
  }

  /**  */

  /**
   * Returns the success value or throws a `ResultError`.
   *
   * @returns The success value.
   * @throws ResultError If the result is a failure.
   */
  orThrow(): T {
    if (this.#state === States.Err) {
      if (this.#error instanceof Error) {
        throw new ResultError(`Result is error ${this.#error.message}`, this.#error);
      }

      throw new ResultError(`Result is error ${stringify(this.#error)}`);
    }

    return this.#value!;
  }

  /**
   * Returns the success value or a fallback value.
   *
   * @param defaultValue Fallback value or lazy fallback factory.
   * @returns The success value when present, otherwise the fallback value.
   */
  orDefault(defaultValue: T | (() => T)): T {
    if (this.#state === States.Ok) {
      return this.#value!;
    }

    return typeof defaultValue === "function" ? (defaultValue as () => T)() : defaultValue;
  }

  /**
   * Returns the failure value or throws when the result is ok.
   *
   * @returns The failure value.
   * @throws ResultError If the result is ok.
   */
  orRequireError(): E {
    if (this.#state === States.Ok) {
      throw new ResultError("Result expected to be error, but had a value");
    }

    return this.#error!;
  }

  /**
   * Returns the failure value or computes a fallback error value.
   *
   * The fallback is only used when the result is ok.
   *
   * @param defaultValue Fallback error value or lazy fallback factory.
   * @returns The current failure value, or the fallback when the result is ok.
   * @throws ResultError If the result is ok and a non-error, non-function value is supplied.
   */
  orDefaultError(defaultValue: E | (() => E)): E {
    if (this.#state === States.Ok) {
      if (defaultValue instanceof Error) {
        return defaultValue as E;
      }

      if (typeof defaultValue === "function") {
        return (defaultValue as () => E)();
      }

      throw new ResultError(
        `Result is Ok, but default error is provided: ${JSON.stringify(defaultValue)}`,
      );
    }

    return this.#error!;
  }

  /**
   * Runs a side-effect for ok results and returns the original result.
   *
   * @param fn Callback invoked with the success value.
   * @returns The original result.
   */
  inspect(fn: (value: T) => void): Result<T, E> {
    if (this.#state === States.Ok) {
      fn(this.#value!);
    }

    return this;
  }

  /**
   * Returns the success value or throws a `ResultError` with a custom message.
   *
   * @param message The error message to use when the result is a failure.
   * @returns The success value.
   * @throws ResultError If the result is a failure.
   */
  expect(message: string): T {
    if (this.#state === States.Err) {
      throw new ResultError(message);
    }

    return this.#value!;
  }

  /**
   * Returns the failure value or throws a `ResultError` with a custom message.
   *
   * @param message The error message to use when the result is ok.
   * @returns The failure value.
   * @throws ResultError If the result is ok.
   */
  expectError(message: string): E {
    if (this.#state === States.Ok) {
      throw new ResultError(message);
    }

    return this.#error!;
  }

  /**
   * Maps the success value to a plain value, or returns a fallback when failed.
   *
   * @param fn Mapper invoked for ok results.
   * @param factory Fallback value or lazy fallback factory for failures.
   * @returns The mapped success value or fallback value.
   */
  mapValue<U>(fn: (value: T) => U, factory: U | (() => U)): U {
    if (this.#state === States.Err) {
      return typeof factory === "function" ? (factory as () => U)() : factory;
    }

    return fn(this.#value!);
  }

  /**
   * Maps the success value to another `Result`, optionally mapping failures too.
   *
   * @param fn Mapper invoked for ok results.
   * @param mapError Optional mapper invoked for failures.
   * @returns A new result containing the mapped value or mapped error.
   */
  map<U = T, F = E>(fn: (value: T) => U, mapError?: (error: E) => F): Result<U, F> {
    if (this.#state === States.Err) {
      mapError ??= (error) => error as unknown as F;
      return new Result<U, F>(undefined, mapError(this.#error!));
    }

    return new Result(fn(this.#value!));
  }

  /**
   * Maps the failure value to a plain value, or returns a fallback when ok.
   *
   * @param fn Mapper invoked for failures.
   * @param factory Fallback value or lazy fallback factory for ok results.
   * @returns The mapped failure value or fallback value.
   */
  mapError<F>(fn: (error: E) => F, factory: F | (() => F)): F {
    if (this.#state === States.Ok) {
      return typeof factory === "function" ? (factory as () => F)() : factory;
    }

    return fn(this.#error!);
  }
}

/**
 * Represents a successful result with a value of type `T`.
 *
 * @param value The success value.
 */
export class Ok<T> extends Result<T, never> {
  constructor(value: T) {
    super(value);
  }
}

/**
 * Represents a reusable empty success result.
 *
 * @example Usage
 * ```ts
 * import { empty } from "@neostd/results";
 *
 * empty().ok; // true
 * ```
 */
export class EmptyResult<E = Error> extends Result<void, E> {
  
  
  constructor(error?: E) {
    super(void 0, error);
  }

  /**
   * Creates a new empty result from a function that throws.
   *
   * The function is executed and the error is captured. If the function
   * throws a string, it is wrapped in an `Error` instance. If the function
   * throws an `Error` instance, it is preserved. Otherwise, a generic
   * `Error` message is used.
   *
   * @param fn Function to execute.
   * @returns A new empty result containing the thrown error.
   */
  static tryCatch<T>(fn: () => void): EmptyResult<Error> {
     try {
       fn();
       return empty();
     } catch (error) {
        if (error instanceof Error) {
          return new EmptyResult(error);
        }

        if (typeof error === "string") {
          return new EmptyResult(new Error(error));
        }

      
        return new EmptyResult(new Error(`Error: ${error}`));
     }
  }

   /**
   * Creates a new empty result from an async function that rejects.
   *
   * The function is executed and the error is captured. If the function
   * rejects a string, it is wrapped in an `Error` instance. If the function
   * rejects an `Error` instance, it is preserved. Otherwise, a generic
   * `Error` message is used.
   *
   * @param fn Async function to execute.
   * @returns A new empty result containing the rejected error.
   */
   static async tryCatchAsync<T>(fn: () => Promise<void>): Promise<EmptyResult<Error>> {
    try {
      await fn();
      return empty();
    } catch (error) {
      if (error instanceof Error) {
        return Promise.resolve(new EmptyResult(error));
      }

      if (typeof error === "string") {
        return Promise.resolve(new EmptyResult(new Error(error)));
      }

      return Promise.resolve(new EmptyResult(new Error(`Error: ${error}`)));
    }
  }
}

const emptyResult = new EmptyResult<never>();

/**
 * Represents a failed result with an error of type `E`.
 *
 * @param error The failure value.
 */
export class Failure<E = Error> extends Result<never, E> {
  constructor(error: E) {
    super(undefined, error, States.Err);
  }
}

/**
 * Creates a successful result.
 *
 * @example Usage
 * ```ts
 * import { ok } from "@neostd/results";
 *
 * ok(42).ok; // true
 * ```
 *
 * @param value The success value.
 * @returns A successful result containing `value`.
 */
export function ok<T, E>(value: T): Result<T, E> {
  return new Ok(value);
}

/**
 * Returns a shared empty success result.
 *
 * @returns An ok result containing `undefined`.
 */
export function empty(): EmptyResult {
  return emptyResult;
}

/**
 * Creates a failed result.
 *
 * @example Usage
 * ```ts
 * import { fail } from "@neostd/results";
 *
 * fail(new Error("boom")).failed; // true
 * ```
 *
 * @param error The failure value.
 * @returns A failed result containing `error`.
 */
export function fail<T = never, E = Error>(error: E): Result<T, E> {
  return new Failure(error);
}

/**
 * Converts an unknown value into a failed `Result<T, Error>`.
 *
 * Strings are wrapped directly, `Error` instances are preserved, and other
 * values are stringified into a generic `Error` message.
 *
 * @param error The unknown error value.
 * @returns A failed result containing an `Error` instance.
 */
export function failAsError<T = unknown>(error: unknown): Result<T> {
  if (error instanceof Error) {
    return fail(error);
  }

  if (typeof error === "string") {
    return fail(new Error(error));
  }

  return fail(new Error(`Unexpected error: ${stringify(error)}`));
}

/**
 * Matches a result into a single value.
 *
 * @param result Result to inspect.
 * @param ok Called with the success value.
 * @param err Called with the failure value.
 * @returns The return value from the selected branch.
 */
export function match<T, E, U>(result: Result<T, E>, ok: (value: T) => U, err: (error: E) => U): U {
  if (result.ok) {
    return ok(result.value!);
  }

  return err(result.error!);
}

/**
 * Executes a function and captures thrown errors as a `Result`.
 *
 * @example Usage
 * ```ts
 * import { tryCatch } from "@neostd/results";
 *
 * const parsed = tryCatch(() => JSON.parse('{"ok":true}'));
 * ```
 *
 * @param fn Function to execute.
 * @param onRejected map to an error when an error is thrown.
 * @returns An ok result with the return value, or a failed result with an `Error`.
 */
export function tryCatch<T>(fn: () => T, onRejected?: (error: unknown) => Error): Result<T, Error> {
  try {
    return ok(fn());
  } catch (error) {
    if (onRejected) {
      const e = onRejected(error);
      return new Result<T, Error>(undefined, e);
    }

    if (error instanceof Error) {
      return fail(error);
    }

    if (typeof error === "string") {
      return fail(new Error(error));
    }

    return fail(new Error(`Error: ${stringify(error)}`));
  }
}

/**
 * Executes an async function and captures rejected errors as a `Result`.
 *
 * @example Usage
 * ```ts
 * import { tryCatchAsync } from "@neostd/results";
 *
 * const response = await tryCatchAsync(() => fetch("https://example.com"));
 * ```
 *
 * @param fn Async function to execute.
 * @param onRejected map to an error when an error is thrown.
 * @returns A promise that resolves to an ok result with the return value, or a failed result with an `Error`.
 */
export async function tryCatchAsync<T>(
  fn: () => Promise<T>, 
  onRejected?: (error: unknown) => Error): Promise<Result<T, Error>> {
  try {
    const value = await fn();
    return ok(value);
  } catch (error) {
    if (onRejected) {
      const e = onRejected(error);
      return new Result<T, Error>(undefined, e);
    }

    if (typeof error === "string") {
       return fail(new Error(error));
    }

    if (error instanceof Error) {
      return fail(error);
    }

    return fail(new Error(`Error: ${stringify(error)}`));
  }
}
