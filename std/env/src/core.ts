import { expand as substitute, type SubstitutionOptions } from "./expand.ts";
import { BROWSER, globals, WINDOWS } from "./globals.ts";

const WIN_DESKTOP = WINDOWS && !BROWSER;
const SEP = WIN_DESKTOP ? ";" : ":";
const PATH_NAME = WIN_DESKTOP ? "Path" : "PATH";
const browserEnv: Record<string, string> = {};

/** Node-like cross-runtime environment variable object. */
export type EnvProxy = Record<string, string | undefined>;

function equalFold(left: string, right: string): boolean {
  return left.localeCompare(right, undefined, { sensitivity: "accent" }) === 0;
}

function snapshot(): Record<string, string> {
  if (globals.Deno) {
    return globals.Deno.env.toObject();
  }

  if (globals.process) {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(globals.process.env)) {
      if (value !== undefined) {
        result[key] = value;
      }
    }

    return result;
  }

  return { ...browserEnv };
}

function getEnv(name: string): string | undefined {
  if (globals.Deno) {
    return globals.Deno.env.get(name);
  }

  if (globals.process) {
    return globals.process.env[name];
  }

  return browserEnv[name];
}

function setEnv(name: string, value: unknown): void {
  const stringValue = String(value);

  if (globals.Deno) {
    globals.Deno.env.set(name, stringValue);
    return;
  }

  if (globals.process) {
    globals.process.env[name] = stringValue;
    return;
  }

  browserEnv[name] = stringValue;
}

function deleteEnv(name: string): void {
  if (globals.Deno) {
    globals.Deno.env.delete(name);
    return;
  }

  if (globals.process) {
    delete globals.process.env[name];
    return;
  }

  delete browserEnv[name];
}

/**
 * A proxy object that lets you interact with environment variables like Node's `process.env`.
 *
 * Browser and worker runtimes without process environment APIs use an isolated in-memory store.
 */
export const proxy: EnvProxy = new Proxy<EnvProxy>(
  {},
  {
    get(_target, property): string | undefined {
      if (typeof property !== "string" || property.length === 0) {
        return undefined;
      }

      return getEnv(property);
    },
    set(_target, property, value): boolean {
      if (typeof property !== "string" || property.length === 0) {
        return false;
      }

      setEnv(property, value);
      return true;
    },
    deleteProperty(_target, property): boolean {
      if (typeof property !== "string" || property.length === 0) {
        return false;
      }

      deleteEnv(property);
      return true;
    },
    has(_target, property): boolean {
      return typeof property === "string" && property.length > 0 && getEnv(property) !== undefined;
    },
    ownKeys(): ArrayLike<string | symbol> {
      return Object.keys(snapshot());
    },
    getOwnPropertyDescriptor(_target, property): PropertyDescriptor | undefined {
      if (typeof property !== "string" || property.length === 0) {
        return undefined;
      }

      const value = getEnv(property);
      if (value === undefined) {
        return undefined;
      }

      return {
        configurable: true,
        enumerable: true,
        value,
        writable: true,
      };
    },
    defineProperty(_target, property, descriptor): boolean {
      if (typeof property !== "string" || property.length === 0 || !("value" in descriptor)) {
        return false;
      }

      setEnv(property, descriptor.value);
      return true;
    },
  },
);

/**
 * Retrieves the value of the specified environment variable.
 *
 * @param name - The name of the environment variable.
 * @returns The value of the environment variable, or `undefined` if it is not set.
 *
 * @example Get an environment variable
 * ```ts
 * import { get, set } from "@neostd/env";
 *
 * set("MY_VAR", "test");
 * console.log(get("MY_VAR")); // "test"
 * console.log(get("UNDEFINED_VAR")); // undefined
 * ```
 */
export function get(name: string): string | undefined {
  return getEnv(name);
}

/**
 * Expands a template string using the current environment variables.
 *
 * Supports bash-style variable expansion including:
 * - `${VAR}` - Simple variable expansion
 * - `${VAR:-default}` - Use default if VAR is unset
 * - `${VAR:=default}` - Assign default if VAR is unset
 * - `${VAR:?error}` - Throw error if VAR is unset
 * - `%VAR%` - Windows-style expansion (optional)
 *
 * @param template - The template string to expand.
 * @param options - Optional substitution options to customize expansion behavior.
 * @returns The expanded string with variables replaced.
 *
 * @example Expand bash-style variables
 * ```ts
 * import { expand, set } from "@neostd/env";
 *
 * set("NAME", "Alice");
 * console.log(expand("Hello, ${NAME}!")); // "Hello, Alice!"
 * console.log(expand("${UNSET:-default}")); // "default"
 * ```
 *
 * @example Windows-style expansion
 * ```ts
 * import { expand, set } from "@neostd/env";
 *
 * set("USER", "Bob");
 * console.log(expand("%USER%", { windowsExpansion: true })); // "Bob"
 * ```
 */
export function expand(template: string, options?: SubstitutionOptions): string {
  return substitute(template, { get, set, ...options });
}

/**
 * Sets the value of the specified environment variable.
 *
 * @param name - The name of the environment variable.
 * @param value - The value to set.
 *
 * @example Set an environment variable
 * ```ts
 * import { set, get } from "@neostd/env";
 *
 * set("MY_VAR", "test");
 * console.log(get("MY_VAR")); // "test"
 * ```
 */
export function set(name: string, value: string): void {
  proxy[name] = value;
}

/**
 * Removes the specified environment variable from the environment.
 *
 * @param name - The name of the environment variable to remove.
 *
 * @example Remove an environment variable
 * ```ts
 * import { remove, get, set } from "@neostd/env";
 *
 * set("MY_VAR", "test");
 * console.log(get("MY_VAR")); // "test"
 * remove("MY_VAR");
 * console.log(get("MY_VAR")); // undefined
 * ```
 */
export function remove(name: string): void {
  delete proxy[name];
}

/**
 * Determines if the specified environment variable is set.
 *
 * @param name - The name of the environment variable.
 * @returns `true` if the environment variable is set, `false` otherwise.
 *
 * @example Check if variable exists
 * ```ts
 * import { has, set } from "@neostd/env";
 *
 * set("MY_VAR", "test");
 * console.log(has("MY_VAR")); // true
 * console.log(has("NOT_SET")); // false
 * ```
 */
export function has(name: string): boolean {
  return proxy[name] !== undefined;
}

/**
 * Clones and returns all environment variables as a record of key-value pairs.
 *
 * @returns A shallow copy of all environment variables as an object.
 *
 * @example Get all environment variables
 * ```ts
 * import { toObject, set } from "@neostd/env";
 *
 * set("MY_VAR", "test");
 * const env = toObject();
 * console.log(env.MY_VAR); // "test"
 * // Note: Will also include other system environment variables
 * ```
 */
export function toObject(): Record<string, string | undefined> {
  return { ...proxy };
}

/**
 * Merges the provided environment variables into the current environment.
 *
 * This function will overwrite existing values in the environment with the provided values.
 * If a value is `undefined` or `null`, the corresponding variable will be removed.
 *
 * @param values - A record of environment variables to merge.
 *
 * @example Merge environment variables
 * ```ts
 * import { merge, set, get } from "@neostd/env";
 *
 * set("MY_VAR", "test");
 * merge({ "MY_VAR": undefined, "MY_VAR2": "test2" });
 * console.log(get("MY_VAR")); // undefined (removed)
 * console.log(get("MY_VAR2")); // "test2"
 * ```
 */
export function merge(values: Record<string, string | undefined | null>): void {
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null) {
      delete proxy[key];
    } else {
      proxy[key] = value;
    }
  }
}

/**
 * Unions the provided environment variables into the current environment.
 *
 * This function will only add new values to the environment if they do not already exist.
 * Existing values are preserved and `undefined` values in the input are ignored.
 *
 * @param values - A record of environment variables to add.
 *
 * @example Union environment variables
 * ```ts
 * import { union, set, get } from "@neostd/env";
 *
 * set("MY_VAR", "original");
 * union({ "MY_VAR": "ignored", "MY_VAR2": "new" });
 * console.log(get("MY_VAR")); // "original" (preserved)
 * console.log(get("MY_VAR2")); // "new"
 * ```
 */
export function union(values: Record<string, string | undefined>): void {
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && proxy[key] === undefined) {
      proxy[key] = value;
    }
  }
}

/**
 * Gets the system PATH environment variable.
 *
 * Returns the PATH (Unix) or Path (Windows) environment variable.
 *
 * @returns The PATH as a string, or empty string if not set.
 *
 * @example Get the PATH
 * ```ts
 * import { getPath } from "@neostd/env";
 *
 * console.log(getPath()); // "/usr/local/bin:/usr/bin:/bin"
 * ```
 */
export function path(): string {
  return get(PATH_NAME) ?? "";
}

/**
 * Sets the system PATH environment variable.
 *
 * Replaces the entire PATH (Unix) or Path (Windows) with the specified value.
 *
 * @param value - The new PATH value to set.
 *
 * @example Set the PATH
 * ```ts
 * import { setPath, getPath } from "@neostd/env";
 *
 * setPath("/usr/local/bin:/usr/bin:/bin");
 * console.log(getPath()); // "/usr/local/bin:/usr/bin:/bin"
 * ```
 */
export function setPath(value: string): void {
  set(PATH_NAME, value);
}

/**
 * Checks if a path exists in the system PATH environment variable.
 *
 * On Windows, comparison is case-insensitive.
 *
 * @param value - The path to check for.
 * @param paths - Optional array of paths to check against. If not provided, uses the current PATH.
 * @returns `true` if the path exists in PATH, `false` otherwise.
 *
 * @example Check if path exists
 * ```ts
 * import { hasPath, appendPath } from "@neostd/env";
 *
 * appendPath("/usr/local/bin");
 * console.log(hasPath("/usr/local/bin")); // true
 * console.log(hasPath("/nonexistent")); // false
 * ```
 */
export function hasPath(value: string, paths = splitPath()): boolean {
  return paths.some((path) => (WIN_DESKTOP ? equalFold(path, value) : path === value));
}

/**
 * Joins an array of paths into a single PATH string.
 *
 * Uses the appropriate separator (`:` on Unix, `;` on Windows).
 *
 * @param paths - The array of paths to join.
 * @returns The joined path string.
 *
 * @example Join paths
 * ```ts
 * import { joinPath } from "@neostd/env";
 *
 * // On Unix:
 * console.log(joinPath(["/usr/local/bin", "/usr/bin"])); // "/usr/local/bin:/usr/bin"
 * ```
 */
export function joinPath(paths: string[]): string {
  return paths.join(SEP);
}

/**
 * Splits the PATH environment variable into an array of paths.
 *
 * Empty paths are filtered out from the result.
 *
 * @param paths - Optional paths string to split. If not provided, uses the current PATH.
 * @returns An array of non-empty path strings.
 *
 * @example Split the PATH
 * ```ts
 * import { splitPath } from "@neostd/env";
 *
 * console.log(splitPath()); // ["/usr/local/bin", "/usr/bin", "/bin"]
 * console.log(splitPath("/a:/b")); // ["/a", "/b"]
 * ```
 */
export function splitPath(paths = path()): string[] {
  return paths.split(SEP).filter((part) => part.length > 0);
}

/**
 * Appends a path to the end of the system PATH environment variable.
 *
 * By default, the path is not added if it already exists.
 *
 * @param path - The path to append.
 * @param force - If `true`, appends even if the path already exists.
 *
 * @example Append to PATH
 * ```ts
 * import { appendPath, getPath, setPath } from "@neostd/env";
 *
 * setPath("/usr/bin:/bin");
 * appendPath("/usr/local/bin");
 * console.log(getPath()); // "/usr/bin:/bin:/usr/local/bin"
 * ```
 */
export function appendPath(path: string, force = false): void {
  const paths = splitPath();
  if (force || !hasPath(path, paths)) {
    paths.push(path);
    setPath(joinPath(paths));
  }
}

/**
 * Prepends a path to the beginning of the system PATH environment variable.
 *
 * By default, the path is not added if it already exists.
 *
 * @param path - The path to prepend.
 * @param force - If `true`, prepends even if the path already exists.
 *
 * @example Prepend to PATH
 * ```ts
 * import { prependPath, getPath, setPath } from "@neostd/env";
 *
 * setPath("/usr/bin:/bin");
 * prependPath("/usr/local/bin");
 * console.log(getPath()); // "/usr/local/bin:/usr/bin:/bin"
 * ```
 */
export function prependPath(path: string, force = false): void {
  const paths = splitPath();
  if (force || !hasPath(path, paths)) {
    paths.unshift(path);
    setPath(joinPath(paths));
  }
}

/**
 * Removes a path from the system PATH environment variable.
 *
 * On Windows, comparison is case-insensitive.
 *
 * @param path - The path to remove.
 *
 * @example Remove from PATH
 * ```ts
 * import { removePath, appendPath, hasPath } from "@neostd/env";
 *
 * appendPath("/custom/bin");
 * console.log(hasPath("/custom/bin")); // true
 * removePath("/custom/bin");
 * console.log(hasPath("/custom/bin")); // false
 * ```
 */
export function removePath(path: string): void {
  const paths = splitPath();
  const index = paths.findIndex((entry) => (WIN_DESKTOP ? equalFold(entry, path) : entry === path));
  if (index !== -1) {
    paths.splice(index, 1);
    setPath(joinPath(paths));
  }
}

/**
 * Replaces a path in the system PATH environment variable with a new path.
 *
 * If the old path is not found, no changes are made.
 * On Windows, comparison is case-insensitive.
 *
 * @param oldPath - The path to replace.
 * @param newPath - The new path to use.
 *
 * @example Replace a path in PATH
 * ```ts
 * import { replacePath, appendPath, hasPath } from "@neostd/env";
 *
 * appendPath("/old/bin");
 * replacePath("/old/bin", "/new/bin");
 * console.log(hasPath("/old/bin")); // false
 * console.log(hasPath("/new/bin")); // true
 * ```
 */
export function replacePath(oldPath: string, newPath: string): void {
  const paths = splitPath();
  const index = paths.findIndex((entry) =>
    WIN_DESKTOP ? equalFold(entry, oldPath) : entry === oldPath,
  );
  if (index !== -1) {
    paths[index] = newPath;
    setPath(joinPath(paths));
  }
}

/**
 * Gets the current user's home directory.
 *
 * Returns the value of `HOME` (Unix) or `USERPROFILE` (Windows) environment variable.
 *
 * @returns The home directory path, or `undefined` if not set.
 *
 * @example Get home directory
 * ```ts
 * import { home } from "@neostd/env";
 *
 * console.log(home()); // "/home/alice" (Unix) or "C:\\Users\\Alice" (Windows)
 * ```
 */
export function home(): string | undefined {
  return get("HOME") ?? get("USERPROFILE");
}

/**
 * Gets the current user's name.
 *
 * Returns the value of `USER` (Unix) or `USERNAME` (Windows) environment variable.
 *
 * @returns The username, or `undefined` if not set.
 *
 * @example Get current username
 * ```ts
 * import { user } from "@neostd/env";
 *
 * console.log(user()); // "alice"
 * ```
 */
export function user(): string | undefined {
  return get("USER") ?? get("USERNAME");
}

/**
 * Gets the current user's default shell.
 *
 * Returns the value of `SHELL` (Unix) or `ComSpec` (Windows) environment variable.
 *
 * @returns The shell path, or `undefined` if not set.
 *
 * @example Get default shell
 * ```ts
 * import { shell } from "@neostd/env";
 *
 * console.log(shell()); // "/bin/bash" (Unix) or "C:\\Windows\\System32\\cmd.exe" (Windows)
 * ```
 */
export function shell(): string | undefined {
  return get("SHELL") ?? get("ComSpec");
}

/**
 * Gets the machine's hostname.
 *
 * Returns the value of `HOSTNAME` (Unix) or `COMPUTERNAME` (Windows) environment variable.
 *
 * @returns The hostname, or `undefined` if not set.
 *
 * @example Get hostname
 * ```ts
 * import { hostname } from "@neostd/env";
 *
 * console.log(hostname()); // "my-computer"
 * ```
 */
export function hostname(): string | undefined {
  return get("HOSTNAME") ?? get("COMPUTERNAME");
}

/**
 * Gets the operating system type.
 *
 * Returns the value of `OS` or `OSTYPE` environment variable.
 *
 * @returns The OS type string, or `undefined` if not set.
 *
 * @example Get OS type
 * ```ts
 * import { os } from "@neostd/env";
 *
 * console.log(os()); // "linux-gnu" (Unix) or "Windows_NT" (Windows)
 * ```
 */
export function os(): string | undefined {
  return get("OS") ?? get("OSTYPE");
}
