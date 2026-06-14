import { equal, ok } from "node:assert/strict";
import { test } from "node:test";
import * as env from "../src/core.ts";

function withPath(value: string, callback: () => void): void {
  const currentPath = env.path();
  try {
    env.setPath(value);
    callback();
  } finally {
    env.setPath(currentPath);
  }
}

function versionCommand(): { command: string; expected: string } {
  const deno = (globalThis as { Deno?: { execPath(): string; version: { deno: string } } }).Deno;
  if (deno) {
    return {
      command: `${JSON.stringify(deno.execPath())} --version`,
      expected: `deno ${deno.version.deno}`,
    };
  }

  return {
    command: `${JSON.stringify(process.execPath)} --version`,
    expected: process.version,
  };
}

test("env::get", () => {
  env.set("NEOSTD_ENV_TEST_1", "value");
  equal(env.get("NEOSTD_ENV_TEST_1"), "value");
});

test("env::expand", () => {
  env.set("NEOSTD_ENV_NAME", "Alice");
  equal(
    env.expand("Hello, ${NEOSTD_ENV_NAME}! You are ${NEOSTD_ENV_AGE:-30} years old."),
    "Hello, Alice! You are 30 years old.",
  );
  equal(env.expand("HELLO, %NEOSTD_ENV_NAME%!", { windowsExpansion: true }), "HELLO, Alice!");
  equal(env.expand("${NEOSTD_ENV_AGE_NEXT:=30}"), "30");
  equal(env.get("NEOSTD_ENV_AGE_NEXT"), "30");
});

test("env::has", () => {
  env.set("NEOSTD_ENV_TEST_2", "value");
  ok(env.has("NEOSTD_ENV_TEST_2"));
  ok(!env.has("NEOSTD_ENV_NOT_SET"));
});

test("env::remove", () => {
  env.set("NEOSTD_ENV_TEST_REMOVE", "value");
  ok(env.has("NEOSTD_ENV_TEST_REMOVE"));
  env.remove("NEOSTD_ENV_TEST_REMOVE");
  ok(!env.has("NEOSTD_ENV_TEST_REMOVE"));
});

test("env::merge", () => {
  env.set("NEOSTD_ENV_TEST_3", "value");
  env.merge({ NEOSTD_ENV_TEST_3: undefined, NEOSTD_ENV_TEST_4: "value" });
  ok(!env.has("NEOSTD_ENV_TEST_3"));
  ok(env.has("NEOSTD_ENV_TEST_4"));
});

test("env::union", () => {
  env.remove("NEOSTD_ENV_TEST_32");
  env.union({ NEOSTD_ENV_TEST_32: "value", NEOSTD_ENV_TEST_33: undefined });
  equal(env.proxy.NEOSTD_ENV_TEST_32, "value");
  equal(env.proxy.NEOSTD_ENV_TEST_33, undefined);
});

test("env::toObject", () => {
  env.set("NEOSTD_ENV_TEST_6", "value");
  const obj = env.toObject();
  equal(obj.NEOSTD_ENV_TEST_6, "value");
});

test("env::set", () => {
  env.set("NEOSTD_ENV_TEST_7", "value");
  ok(env.has("NEOSTD_ENV_TEST_7"));
});

test("env::proxy", () => {
  env.proxy.NEOSTD_ENV_PROXY = "value";
  equal(env.get("NEOSTD_ENV_PROXY"), "value");
  ok("NEOSTD_ENV_PROXY" in env.proxy);
  equal({ ...env.proxy }.NEOSTD_ENV_PROXY, "value");
  delete env.proxy.NEOSTD_ENV_PROXY;
  ok(!env.has("NEOSTD_ENV_PROXY"));
});

test("env::appendPath", () => {
  withPath("/base", () => {
    env.appendPath("/neostd_env_append");
    ok(env.hasPath("/neostd_env_append"));
    const paths = env.splitPath();
    equal(paths[paths.length - 1], "/neostd_env_append");
  });
});

test("env::prependPath", () => {
  withPath("/base", () => {
    env.prependPath("/neostd_env_prepend");
    ok(env.hasPath("/neostd_env_prepend"));
    equal(env.splitPath()[0], "/neostd_env_prepend");
  });
});

test("env::removePath", () => {
  withPath(env.joinPath(["/base", "/neostd_env_remove"]), () => {
    ok(env.hasPath("/neostd_env_remove"));
    env.removePath("/neostd_env_remove");
    ok(!env.hasPath("/neostd_env_remove"));
  });
});

test("env::replacePath", () => {
  withPath(env.joinPath(["/base", "/neostd_env_replace"]), () => {
    env.replacePath("/neostd_env_replace", "/neostd_env_replaced");
    ok(!env.hasPath("/neostd_env_replace"));
    ok(env.hasPath("/neostd_env_replaced"));
  });
});

test("env::splitPath", () => {
  withPath(env.joinPath(["/neostd_env_a", "/neostd_env_b"]), () => {
    equal(env.splitPath().length, 2);
    ok(env.splitPath().some((path) => path === "/neostd_env_b"));
  });
});

test("env::hasPath", () => {
  withPath("/neostd_env_has", () => {
    ok(env.hasPath("/neostd_env_has"));
    ok(!env.hasPath("/neostd_env_missing"));
  });
});

test("env::getPath", () => {
  withPath("/neostd_env_path", () => {
    equal(env.path(), "/neostd_env_path");
  });
});

test("env::setPath", () => {
  withPath("/initial", () => {
    env.setPath("/neostd_env_set_path");
    equal(env.path(), "/neostd_env_set_path");
  });
});

test("env::joinPath", () => {
  const joined = env.joinPath(["/neostd_env_join_a", "/neostd_env_join_b"]);
  ok(joined.includes("/neostd_env_join_a"));
  ok(joined.includes("/neostd_env_join_b"));
});

test("env::runtime convenience getters", () => {
  env.merge({
    ComSpec: "cmd.exe",
    COMPUTERNAME: "host",
    HOME: "/home/user",
    HOSTNAME: undefined,
    OS: "Windows_NT",
    SHELL: undefined,
    USER: "neo",
  });
  equal(env.home(), "/home/user");
  equal(env.user(), "neo");
  equal(env.shell(), "cmd.exe");
  equal(env.hostname(), "host");
  equal(env.os(), "Windows_NT");
});

test("env::expand with command substitution", () => {
  const version = versionCommand();
  const result = env.expand(`The value is: $(${version.command})`, { commandSubstitution: true });
  ok(result.startsWith("The value is: "));
  ok(result.includes(version.expected));
});
