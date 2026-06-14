/**
 * The `export` module provides a way to export all the functions from the `core` module.
 *
 * ```ts
 * import { env } from "@neostd/env/export";
 *
 * env.get("KEY"); // Get the value of the environment variable
 * env.set("KEY", "value"); // Set the value of the environment variable
 * ```
 *
 * @module
 */
export * as env from "./core.ts";
