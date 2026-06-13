import { deepStrictEqual, ok, strictEqual, throws } from "node:assert/strict";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { ChangeDirectoryError, chdir, onChdir } from "../src/chdir.ts";
import { cwd } from "../src/cwd.ts";

test("process::chdir changes to absolute path", () => {
  const original = cwd();
  const parent = dirname(original);

  chdir(parent);
  strictEqual(cwd(), parent);

  chdir(original);
});

test("process::chdir changes to relative path", () => {
  const original = cwd();
  const parent = resolve(join(original, ".."));

  chdir("..");
  strictEqual(cwd(), parent);

  chdir(original);
});

test("process::chdir handles current directory", () => {
  const original = cwd();
  chdir(".");
  strictEqual(cwd(), original);
});

test("process::chdir returns undefined", () => {
  strictEqual(chdir("."), undefined);
});

test("process::chdir throws ChangeDirectoryError for non-existent path", () => {
  throws(() => chdir("/nonexistent/path/that/should/not/exist/12345"), ChangeDirectoryError);
});

test("process::ChangeDirectoryError has correct name", () => {
  const error = new ChangeDirectoryError("test error");
  strictEqual(error.name, "ChangeDirectoryError");
});

test("process::ChangeDirectoryError includes message", () => {
  const error = new ChangeDirectoryError("directory not found");
  ok(error.message.includes("directory not found"));
});

test("process::ChangeDirectoryError preserves cause", () => {
  const cause = new Error("original error");
  const error = new ChangeDirectoryError("wrapper", { cause });
  strictEqual(error.cause, cause);
});

test("process::chdir handles consecutive calls", () => {
  const original = cwd();
  const parent = dirname(original);

  chdir(parent);
  chdir(original);
  chdir(parent);
  chdir(original);

  strictEqual(cwd(), original);
});

test("process::chdir preserves path after failed chdir", () => {
  const original = cwd();

  try {
    chdir("/nonexistent/path/12345");
  } catch {
    // Expected.
  }

  strictEqual(cwd(), original);
});

test("process::onChdir invokes handlers after successful chdir", () => {
  const original = cwd();
  const parent = dirname(original);
  const events: Array<{ cwd: string; directory: string }> = [];
  const off = onChdir((event) => {
    events.push(event);
  });

  chdir(parent);

  off.unsubscribe();
  chdir(original);

  deepStrictEqual(events, [{ directory: parent, cwd: parent }]);
});

test("process::onChdir unsubscribe stops future notifications", () => {
  const original = cwd();
  let calls = 0;
  const off = onChdir(() => {
    calls += 1;
  });

  off.unsubscribe();
  off.unsubscribe();
  chdir(".");

  strictEqual(calls, 0);
  chdir(original);
});

test("process::onChdir invokes all handlers before throwing handler errors", () => {
  const original = cwd();
  let secondHandlerCalled = false;
  const firstOff = onChdir(() => {
    throw new Error("handler failed");
  });
  const secondOff = onChdir(() => {
    secondHandlerCalled = true;
  });

  throws(() => chdir("."), /handler failed/);

  firstOff.unsubscribe();
  secondOff.unsubscribe();
  strictEqual(secondHandlerCalled, true);
  strictEqual(cwd(), original);
});

test("process::onChdir registration is disposable with using", () => {
  const original = cwd();
  let calls = 0;

  {
    using _registration = onChdir(() => {
      calls += 1;
    });

    chdir(".");
  }

  chdir(".");
  strictEqual(calls, 1);
  chdir(original);
});
