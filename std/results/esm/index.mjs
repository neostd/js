//#region src/index.ts
const States = {
  Ok: 0,
  Err: 1,
};
function stringify(value) {
  return typeof value === "string" ? value : String(value);
}
/** Represents an error that occurred while processing a result. */
var ResultError = class extends Error {
  constructor(message, options) {
    super(message ?? "Result error.", options);
    this.name = "ResultError";
  }
};
/** Represents a result that can either be a value of type `T` or an error of type `E`. */
var Result = class Result {
  #state;
  #value;
  #error;
  constructor(value, error, state = error === void 0 ? States.Ok : States.Err) {
    if (state === States.Ok && error !== void 0)
      throw new ResultError("Result cannot have both value and error");
    if (state === States.Err && value !== void 0)
      throw new ResultError("Result cannot have both value and error");
    this.#state = state;
    this.#value = value;
    this.#error = error;
  }
  get ok() {
    return this.#state === States.Ok;
  }
  get failed() {
    return this.#state === States.Err;
  }
  get value() {
    return this.#value;
  }
  get error() {
    return this.#error;
  }
  and(other) {
    if (this.#state === States.Ok) return other instanceof Result ? other : ok(other);
    return new Result(void 0, this.#error);
  }
  andThen(fn) {
    if (this.#state === States.Err) return new Result(void 0, this.#error);
    return fn(this.#value);
  }
  or(other) {
    if (this.#state === States.Ok) return this;
    return other instanceof Result ? other : ok(other);
  }
  orElse(fn) {
    if (this.#state === States.Ok) return this;
    return fn(this.#error);
  }
  test(fn) {
    return this.#state === States.Ok ? fn(this.#value) : false;
  }
  testError(fn) {
    return this.#state === States.Err ? fn(this.#error) : false;
  }
  match(ok, err) {
    if (this.#state === States.Ok) return ok(this.#value);
    return err(this.#error);
  }
  toArray() {
    return this.#state === States.Ok ? [this.#value] : [];
  }
  toIterable() {
    return this.#state === States.Ok ? [this.#value] : [];
  }
  resolve() {
    return this.#state === States.Ok ? Promise.resolve(this.#value) : Promise.reject(this.#error);
  }
  orThrow() {
    if (this.#state === States.Err) {
      if (this.#error instanceof Error)
        throw new ResultError(`Result is error ${this.#error.message}`, this.#error);
      throw new ResultError(`Result is error ${stringify(this.#error)}`);
    }
    return this.#value;
  }
  orDefault(defaultValue) {
    if (this.#state === States.Ok) return this.#value;
    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  }
  orRequireError() {
    if (this.#state === States.Ok)
      throw new ResultError("Result expected to be error, but had a value");
    return this.#error;
  }
  orDefaultError(defaultValue) {
    if (this.#state === States.Ok) {
      if (defaultValue instanceof Error) return defaultValue;
      if (typeof defaultValue === "function") return defaultValue();
      throw new ResultError(
        `Result is Ok, but default error is provided: ${JSON.stringify(defaultValue)}`,
      );
    }
    return this.#error;
  }
  inspect(fn) {
    if (this.#state === States.Ok) fn(this.#value);
    return this;
  }
  expect(message) {
    if (this.#state === States.Err) throw new ResultError(message);
    return this.#value;
  }
  expectError(message) {
    if (this.#state === States.Ok) throw new ResultError(message);
    return this.#error;
  }
  mapValue(fn, factory) {
    if (this.#state === States.Err) return typeof factory === "function" ? factory() : factory;
    return fn(this.#value);
  }
  map(fn, mapError) {
    if (this.#state === States.Err) {
      mapError ??= (error) => error;
      return new Result(void 0, mapError(this.#error));
    }
    return new Result(fn(this.#value));
  }
  mapError(fn, factory) {
    if (this.#state === States.Ok) return typeof factory === "function" ? factory() : factory;
    return fn(this.#error);
  }
};
/** Represents a successful result with a value of type `T`. */
var Ok = class extends Result {
  constructor(value) {
    super(value);
  }
};
var EmptyResult = class extends Result {
  constructor() {
    super(void 0);
  }
};
const emptyResult = new EmptyResult();
/** Represents an error result with an error of type `E`. */
var Failure = class extends Result {
  constructor(error) {
    super(void 0, error, States.Err);
  }
};
function ok(value) {
  return new Ok(value);
}
function empty() {
  return emptyResult;
}
function fail(error) {
  return new Failure(error);
}
function failAsError(error) {
  if (error instanceof Error) return fail(error);
  if (typeof error === "string") return fail(new Error(error));
  return fail(/* @__PURE__ */ new Error(`Unexpected error: ${stringify(error)}`));
}
function match(result, ok, err) {
  if (result.ok) return ok(result.value);
  return err(result.error);
}
function voided() {
  return new Ok(void 0);
}
function tryCatch(fn) {
  try {
    return ok(fn());
  } catch (error) {
    if (error instanceof Error) return fail(error);
    return fail(new Error(stringify(error)));
  }
}
async function tryCatchAsync(fn) {
  try {
    return ok(await fn());
  } catch (error) {
    if (error instanceof Error) return fail(error);
    return fail(new Error(stringify(error)));
  }
}
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
