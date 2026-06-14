import { rejects, strictEqual, throws } from "node:assert/strict";
import { test } from "node:test";
import {
  EmptyResult,
  Failure,
  empty,
  fail,
  failAsError,
  match,
  Ok,
  ok,
  Result,
  ResultError,
  tryCatch,
  tryCatchAsync,
} from "../src/index.ts";

test("result::ok exposes successful value", () => {
  const result = ok(42);

  strictEqual(result instanceof Ok, true);
  strictEqual(result.ok, true);
  strictEqual(result.failed, false);
  strictEqual(result.orThrow(), 42);
  strictEqual(result.orDefault(7), 42);
  strictEqual(result.toArray()[0], 42);
  strictEqual([...result.toIterable()][0], 42);
});

test("result::fail exposes error value", () => {
  const error = new Error("boom");
  const result = fail<number>(error);

  strictEqual(result.ok, false);
  strictEqual(result.failed, true);
  strictEqual(result.error, error);
  strictEqual(result.value, undefined);
  strictEqual(result instanceof Failure, true);
  throws(() => result.orThrow(), ResultError);
});

test("result::fail supports undefined error values", () => {
  const result = fail<never, undefined>(undefined);

  strictEqual(result.ok, false);
  strictEqual(result.failed, true);
  strictEqual(result.error, undefined);
});

test("result::constructor rejects value and error", () => {
  throws(() => new Result(1, new Error("boom")), ResultError);
});

test("result::and and andThen compose successful values", () => {
  strictEqual(ok(2).and(3).value, 3);
  strictEqual(ok(2).andThen((value) => ok(value + 1)).value, 3);
  strictEqual(fail<number, string>("bad").and(3).error, "bad");
  strictEqual(fail<number, string>("bad").and(ok(3)).error, "bad");
});

test("result::or and orElse recover failures", () => {
  strictEqual(ok(2).or(3).value, 2);
  strictEqual(fail<number, string>("bad").or(3).value, 3);
  strictEqual(fail<number, string>("bad").orElse((error) => ok(error.length)).value, 3);
  strictEqual(ok(2).orElse(() => ok(4)).value, 2);
});

test("result::test and match inspect state", () => {
  strictEqual(
    ok(2).test((value) => value === 2),
    true,
  );
  strictEqual(
    fail<number>(new Error("boom")).test(() => true),
    false,
  );
  strictEqual(
    fail<number, string>("bad").testError((error) => error === "bad"),
    true,
  );

  let matched = "";
  ok("yes").match(
    (value) => (matched = value),
    () => (matched = "no"),
  );
  strictEqual(matched, "yes");
});

test("result::map helpers transform values and errors", () => {
  strictEqual(ok(2).map((value) => value + 1).value, 3);
  strictEqual(fail<number, string>("bad").map((value) => value + 1).error, "bad");
  strictEqual(
    fail<number, string>("bad").map(
      (value) => value + 1,
      (error) => error.length,
    ).error,
    3,
  );
  strictEqual(
    fail<number, string>("bad").mapValue((value) => value + 1, 9),
    9,
  );
  strictEqual(
    ok(2).mapValue((value) => value + 1, 9),
    3,
  );
  strictEqual(
    fail<number, string>("bad").mapError((error) => error.length, 3),
    3,
  );
  strictEqual(
    ok<number, string>(2).mapError((error) => error.length, 4),
    4,
  );
});

test("result::fallback helpers are lazy", () => {
  let valueFactoryCalls = 0;
  let errorFactoryCalls = 0;

  strictEqual(
    fail<number, Error>(new Error("boom")).orDefault(() => {
      valueFactoryCalls += 1;
      return 7;
    }),
    7,
  );
  strictEqual(
    ok(2).orDefault(() => {
      valueFactoryCalls += 1;
      return 9;
    }),
    2,
  );
  strictEqual(
    ok<number, string>(2).orDefaultError(() => {
      errorFactoryCalls += 1;
      return "fallback";
    }),
    "fallback",
  );
  strictEqual(
    fail<number, string>("bad").orDefaultError(() => {
      errorFactoryCalls += 1;
      return "unused";
    }),
    "bad",
  );

  strictEqual(valueFactoryCalls, 1);
  strictEqual(errorFactoryCalls, 1);
});

test("result::error helpers unwrap or throw", () => {
  strictEqual(fail<number, string>("bad").orRequireError(), "bad");
  strictEqual(
    ok<number, string>(2).orDefaultError(() => "fallback"),
    "fallback",
  );
  throws(() => ok(2).orRequireError(), ResultError);
  throws(() => ok<number, string>(2).orDefaultError("fallback-value"), ResultError);
});

test("result::inspect only runs for ok values", () => {
  let calls = 0;
  const success = ok(2).inspect((value) => {
    calls += value;
  });
  const failure = fail<number, string>("bad").inspect(() => {
    calls += 100;
  });

  strictEqual(calls, 2);
  strictEqual(success.value, 2);
  strictEqual(failure.error, "bad");
});

test("result::expect helpers unwrap or throw", () => {
  strictEqual(ok(2).expect("must be ok"), 2);
  strictEqual(fail<number, string>("bad").expectError("must fail"), "bad");
  throws(() => fail<number>(new Error("boom")).expect("must be ok"), ResultError);
  throws(() => ok(2).expectError("must fail"), ResultError);
});

test("result::tryCatch returns success or failure", () => {
  strictEqual(tryCatch(() => 2).value, 2);
  strictEqual(
    tryCatch(() => {
      throw new Error("boom");
    }).error instanceof Error,
    true,
  );
  strictEqual(
    tryCatch(() => {
      throw "boom";
    }).error?.message,
    "boom",
  );
});

test("result::tryCatchAsync returns success or failure", async () => {
  strictEqual((await tryCatchAsync(() => Promise.resolve(2))).value, 2);
  strictEqual(
    (await tryCatchAsync(() => Promise.reject(new Error("boom")))).error instanceof Error,
    true,
  );
  strictEqual((await tryCatchAsync(() => Promise.reject("boom"))).error?.message, "boom");
});

test("result::resolve converts result to promise", async () => {
  strictEqual(await ok(2).resolve(), 2);
  await rejects(() => fail<number>(new Error("boom")).resolve());
});

test("result::misc helpers", () => {
  strictEqual(ok(2).value, 2);
  strictEqual(failAsError("bad").error?.message, "bad");
  strictEqual(failAsError({ code: 500 }).error?.message, "Unexpected error: [object Object]");
  strictEqual(tryCatch(() => 2).value, 2);
  strictEqual(empty().ok, true);
  strictEqual(empty() instanceof EmptyResult, true);
  strictEqual(empty(), empty());
  strictEqual(empty().value, undefined);
  strictEqual(failAsError("bad").error instanceof Error, true);
});

test("result::top-level match helper", () => {
  strictEqual(
    match(
      ok(2),
      (value) => value + 1,
      () => 0,
    ),
    3,
  );
  strictEqual(
    match(
      fail<number, string>("bad"),
      () => 0,
      (error) => error.length,
    ),
    3,
  );
});
