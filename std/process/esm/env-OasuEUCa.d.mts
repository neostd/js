//#region src/env.d.ts
/** Node-like cross-runtime environment variable object. */
type ProcessEnv = Record<string, string | undefined>;
/**
 * Cross-runtime environment variable abstraction.
 *
 * This behaves like Node's `process.env`: read values with `env.NAME`, assign with `env.NAME = "value"`,
 * delete with `delete env.NAME`, and enumerate with `Object.keys(env)` or object spread. Browser usage is
 * backed by an isolated in-memory store because browsers do not expose process environment variables.
 */
declare const env: ProcessEnv;
//#endregion
export { env as n, ProcessEnv as t };
