import { a as globals } from "./globals-Deml3KGm.mjs";
//#region src/env.ts
const browserEnv = {};
function snapshot() {
  if (globals.Deno) return globals.Deno.env.toObject();
  if (globals.process) {
    const result = {};
    for (const [key, value] of Object.entries(globals.process.env))
      if (value !== void 0) result[key] = value;
    return result;
  }
  return { ...browserEnv };
}
function getEnv(name) {
  if (globals.Deno) return globals.Deno.env.get(name);
  if (globals.process) return globals.process.env[name];
  return browserEnv[name];
}
function setEnv(name, value) {
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
function deleteEnv(name) {
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
const env = new Proxy(
  {},
  {
    get(_target, property) {
      if (typeof property !== "string") return;
      return getEnv(property);
    },
    set(_target, property, value) {
      if (typeof property !== "string") return false;
      setEnv(property, value);
      return true;
    },
    deleteProperty(_target, property) {
      if (typeof property !== "string") return false;
      deleteEnv(property);
      return true;
    },
    has(_target, property) {
      return typeof property === "string" && getEnv(property) !== void 0;
    },
    ownKeys() {
      return Object.keys(snapshot());
    },
    getOwnPropertyDescriptor(_target, property) {
      if (typeof property !== "string") return;
      const value = getEnv(property);
      if (value === void 0) return;
      return {
        configurable: true,
        enumerable: true,
        value,
        writable: true,
      };
    },
    defineProperty(_target, property, descriptor) {
      if (typeof property !== "string" || !("value" in descriptor)) return false;
      setEnv(property, descriptor.value);
      return true;
    },
  },
);
//#endregion
export { env as t };
