import { equal, ok, throws } from "node:assert/strict";
import { test } from "node:test";
import { expand as expandTemplate, expandAsync, type SubstitutionOptions } from "../src/expand.ts";

function createEnv(): {
  env: Record<string, string>;
  get: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
} {
  const env: Record<string, string> = {};
  return {
    env,
    get: (key) => env[key],
    set: (key, value) => {
      env[key] = value;
    },
  };
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

function customShellArgs(): string[] {
  return process.platform === "win32" ? ["cmd.exe", "/d", "/s", "/c"] : ["sh", "-c"];
}

function expand(
  template: string,
  get: (key: string) => string | undefined,
  set: (key: string, value: string) => void,
  options?: SubstitutionOptions,
): string {
  return expandTemplate(template, { get, set, ...options });
}

test("expand::basic bash variable ${VAR}", () => {
  const { env, get, set } = createEnv();
  env.NAME = "Alice";
  equal(expand("Hello, ${NAME}!", get, set), "Hello, Alice!");
});

test("expand::basic bash variable $VAR", () => {
  const { env, get, set } = createEnv();
  env.NAME = "Bob";
  equal(expand("Hello, $NAME!", get, set), "Hello, Bob!");
});

test("expand::multiple variables", () => {
  const { env, get, set } = createEnv();
  env.FIRST = "John";
  env.LAST = "Doe";
  equal(expand("${FIRST} ${LAST}", get, set), "John Doe");
});

test("expand::empty template", () => {
  const { get, set } = createEnv();
  equal(expand("", get, set), "");
});

test("expand::no variables", () => {
  const { get, set } = createEnv();
  equal(expand("Hello, World!", get, set), "Hello, World!");
});

test("expand::default value with :- when variable is unset", () => {
  const { get, set } = createEnv();
  equal(expand("${UNSET:-default}", get, set), "default");
});

test("expand::default value with :- when variable is set", () => {
  const { env, get, set } = createEnv();
  env.SET = "value";
  equal(expand("${SET:-default}", get, set), "value");
});

test("expand::default value with : when variable is unset", () => {
  const { get, set } = createEnv();
  equal(expand("${UNSET:fallback}", get, set), "fallback");
});

test("expand::assignment with := when variable is unset", () => {
  const { env, get, set } = createEnv();
  equal(expand("${NEW_VAR:=assigned}", get, set), "assigned");
  equal(env.NEW_VAR, "assigned");
});

test("expand::assignment with := when variable is set", () => {
  const { env, get, set } = createEnv();
  env.EXISTING = "original";
  equal(expand("${EXISTING:=ignored}", get, set), "original");
  equal(env.EXISTING, "original");
});

test("expand::assignment disabled with variableAssignment=false", () => {
  const { env, get, set } = createEnv();
  equal(expand("${NEW_VAR2:=value}", get, set, { variableAssignment: false }), "value");
  equal(env.NEW_VAR2, undefined);
});

test("expand::error with :? when variable is unset", () => {
  const { get, set } = createEnv();
  throws(
    () => expand("${MISSING:?Variable MISSING is required}", get, set),
    /Variable MISSING is required/,
  );
});

test("expand::error with :? when variable is set", () => {
  const { env, get, set } = createEnv();
  env.PRESENT = "exists";
  equal(expand("${PRESENT:?Should not throw}", get, set), "exists");
});

test("expand::error disabled with customErrorMessage=false", () => {
  const { get, set } = createEnv();
  throws(() => expand("${MISSING:?Custom message}", get, set, { customErrorMessage: false }));
});

test("expand::windows expansion with %VAR%", () => {
  const { env, get, set } = createEnv();
  env.USER = "Administrator";
  equal(expand("Hello, %USER%!", get, set, { windowsExpansion: true }), "Hello, Administrator!");
});

test("expand::windows expansion disabled", () => {
  const { env, get, set } = createEnv();
  env.USER = "Admin";
  equal(expand("%USER%", get, set, { windowsExpansion: false }), "%USER%");
});

test("expand::windows consecutive percent signs throw", () => {
  const { get, set } = createEnv();
  throws(
    () => expand("100%% complete", get, set, { windowsExpansion: true }),
    /missing closing token/,
  );
});

test("expand::escaped dollar sign", () => {
  const { get, set } = createEnv();
  equal(expand("Price: \\$100", get, set), "Price: $100");
});

test("expand::escaped dollar followed by variable", () => {
  const { env, get, set } = createEnv();
  env.VAR = "value";
  equal(expand("\\$VAR is ${VAR}", get, set), "$VAR is value");
});

test("expand::invalid variable name throws", () => {
  const { get, set } = createEnv();
  throws(() => expand("${123invalid}", get, set), /invalid variable name/);
});

test("expand::empty braces returns literal", () => {
  const { get, set } = createEnv();
  equal(expand("${}", get, set), "${}");
});

test("expand::unclosed brace throws", () => {
  const { get, set } = createEnv();
  throws(() => expand("${UNCLOSED", get, set), /missing closing token/);
});

test("expand::unclosed windows percent throws", () => {
  const { get, set } = createEnv();
  throws(() => expand("%UNCLOSED", get, set, { windowsExpansion: true }), /missing closing token/);
});

test("expand::variable with underscore", () => {
  const { env, get, set } = createEnv();
  env.MY_VAR_NAME = "test_value";
  equal(expand("${MY_VAR_NAME}", get, set), "test_value");
});

test("expand::variable starting with underscore throws", () => {
  const { env, get, set } = createEnv();
  env._PRIVATE = "secret";
  throws(() => expand("${_PRIVATE}", get, set), /invalid variable name/);
});

test("expand::backslash separates variable from text", () => {
  const { env, get, set } = createEnv();
  env.HOME = "/home/user";
  equal(expand("$HOME\\_TEST", get, set), "/home/user_TEST");
});

test("expand::mixed bash and windows in same string", () => {
  const { env, get, set } = createEnv();
  env.BASH_VAR = "bash";
  env.WIN_VAR = "windows";
  equal(
    expand("${BASH_VAR} and %WIN_VAR%", get, set, { windowsExpansion: true }),
    "bash and windows",
  );
});

test("expand::variableExpansion disabled", () => {
  const { env, get, set } = createEnv();
  env.VAR = "value";
  equal(expand("${VAR}", get, set, { variableExpansion: false }), "${VAR}");
});

test("expand::custom get function", () => {
  const options: SubstitutionOptions = { get: () => "custom_value" };
  equal(expandTemplate("${ANY_VAR}", options), "custom_value");
});

test("expand::custom set function", () => {
  const captured = { key: "", value: "" };
  const options: SubstitutionOptions = {
    set: (key, value) => {
      captured.key = key;
      captured.value = value;
    },
  };
  expandTemplate("${NEW:=assigned}", options);
  equal(captured.key, "NEW");
  equal(captured.value, "assigned");
});

test("expand::complex template with multiple features", () => {
  const { env, get, set } = createEnv();
  env.BASE = "/usr";
  env.APP = "myapp";
  equal(expand("${BASE}/local/bin/${APP}", get, set), "/usr/local/bin/myapp");
});

test("expand::dollar at end of string", () => {
  const { get, set } = createEnv();
  equal(expand("Price: $", get, set), "Price: $");
});

test("expand::dollar followed by non-alphanumeric", () => {
  const { get, set } = createEnv();
  equal(expand("$$ money", get, set), "$$ money");
});

test("expand::variable not set throws", () => {
  const { get, set } = createEnv();
  throws(() => expand("${UNDEFINED_VAR}", get, set), /not set/);
});

test("expand::simple variable not set throws", () => {
  const { get, set } = createEnv();
  throws(() => expand("$UNDEFINED_VAR", get, set), /not set/);
});

test("expand::unicode variable value", () => {
  const { env, get, set } = createEnv();
  env.GREETING = "こんにちは";
  equal(expand("${GREETING}", get, set), "こんにちは");
});

test("expand::emoji variable value", () => {
  const { env, get, set } = createEnv();
  env.EMOJI = "🎉";
  equal(expand("Party: ${EMOJI}", get, set), "Party: 🎉");
});

test("expand::default value with spaces", () => {
  const { get, set } = createEnv();
  equal(expand("${UNSET:-hello world}", get, set), "hello world");
});

test("expand::default value with colon", () => {
  const { get, set } = createEnv();
  equal(expand("${UNSET:-http://example.com}", get, set), "http://example.com");
});

test("expand::command substitution basic", () => {
  const { get, set } = createEnv();
  const version = versionCommand();
  ok(
    expand(`$(${version.command})`, get, set, { commandSubstitution: true }).includes(
      version.expected,
    ),
  );
});

test("expand::command substitution disabled by default", () => {
  const { get, set } = createEnv();
  equal(expand('$(echo "hello")', get, set), '$(echo "hello")');
});

test("expand::command substitution with surrounding text", () => {
  const { get, set } = createEnv();
  const version = versionCommand();
  const result = expand(`The value is: $(${version.command})`, get, set, {
    commandSubstitution: true,
  });
  ok(result.startsWith("The value is: "));
  ok(result.includes(version.expected));
});

test("expand::command substitution with shell", () => {
  const { get, set } = createEnv();
  equal(
    expand("$(echo shell-value)", get, set, { commandSubstitution: true, useShell: true }),
    "shell-value",
  );
});

test("expand::command substitution with custom shell args", () => {
  const { get, set } = createEnv();
  equal(
    expand("$(echo custom-shell)", get, set, {
      commandSubstitution: true,
      shellArgs: customShellArgs(),
      useShell: true,
    }),
    "custom-shell",
  );
});

test("expand::command substitution with variable expansion", () => {
  const { env, get, set } = createEnv();
  env.NAME = "world";
  const version = versionCommand();
  const result = expand(`$(${version.command}) \${NAME}`, get, set, { commandSubstitution: true });
  ok(result.includes(version.expected));
  ok(result.endsWith(" world"));
});

test("expand::command substitution multiple", () => {
  const { get, set } = createEnv();
  const version = versionCommand();
  const result = expand(`$(${version.command}) and $(${version.command})`, get, set, {
    commandSubstitution: true,
  });
  ok(result.includes(version.expected));
  ok(result.lastIndexOf(version.expected) > result.indexOf(version.expected));
});

test("expandAsync::protocol handler resolves urls", async () => {
  const { env, get, set } = createEnv();
  env.SECRET_URL = "keepass:///db.kdbx?key=path/to/key";

  const seen: string[] = [];
  const result = await expandAsync("token=${SECRET_URL}", {
    get,
    set,
    protocolHandler: async (url) => {
      seen.push(url);
      return url === "keepass:///db.kdbx?key=path/to/key" ? "resolved-secret" : url;
    },
  });

  equal(result, "token=resolved-secret");
  equal(seen[0], "keepass:///db.kdbx?key=path/to/key");
});

test("expandAsync::protocol handler resolves defaults", async () => {
  const { get, set } = createEnv();

  const result = await expandAsync("${MISSING:-keepass:///vault.kdbx?key=api/token}", {
    get,
    set,
    protocolHandler: async () => "resolved-default",
  });

  equal(result, "resolved-default");
});
