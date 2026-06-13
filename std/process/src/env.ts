import { globals } from "./globals.ts";

const browserEnv: Record<string, string> = {};

/** Node-like cross-runtime environment variable object. */
export type ProcessEnv = Record<string, string | undefined>;

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
 * Cross-runtime environment variable abstraction.
 *
 * This behaves like Node's `process.env`: read values with `env.NAME`, assign with `env.NAME = "value"`,
 * delete with `delete env.NAME`, and enumerate with `Object.keys(env)` or object spread. Browser usage is
 * backed by an isolated in-memory store because browsers do not expose process environment variables.
 */
export const env: ProcessEnv = new Proxy<ProcessEnv>(
  {},
  {
    get(_target, property): string | undefined {
      if (typeof property !== "string") {
        return undefined;
      }

      return getEnv(property);
    },
    set(_target, property, value): boolean {
      if (typeof property !== "string") {
        return false;
      }

      setEnv(property, value);
      return true;
    },
    deleteProperty(_target, property): boolean {
      if (typeof property !== "string") {
        return false;
      }

      deleteEnv(property);
      return true;
    },
    has(_target, property): boolean {
      return typeof property === "string" && getEnv(property) !== undefined;
    },
    ownKeys(): ArrayLike<string | symbol> {
      return Object.keys(snapshot());
    },
    getOwnPropertyDescriptor(_target, property): PropertyDescriptor | undefined {
      if (typeof property !== "string") {
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
      if (typeof property !== "string" || !("value" in descriptor)) {
        return false;
      }

      setEnv(property, descriptor.value);
      return true;
    },
  },
);
