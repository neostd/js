/**
 * ## Overview
 *
 * Path utilties for operating system file paths that is a re-package
 * of the [@neostd/path](https://jsr.io/@neostd/path) module with minor
 * changes to enable it to work in node and bun.
 *
 * Deno's @neostd/path is based upon [browsify's implementation of path](https://github.com/browserify/path-browserify/tree/master).
 *
 * ![logo](https://raw.githubusercontent.com/neostd/js/refs/heads/master/eng/assets/logo.png)
 *
 * [![JSR](https://jsr.io/badges/@neostd/path)](https://jsr.io/@neostd/path)
 * [![npm version](https://badge.fury.io/js/@neostd%2Fpath.svg)](https://badge.fury.io/js/@neostd%2Fpath)
 * [![GitHub version](https://badge.fury.io/gh/neostd%2Fjs.svg)](https://badge.fury.io/gh/neostd%2Fjs)
 *
 * ## Documentation
 *
 * Documentation is available on [jsr.io](https://jsr.io/@neostd/path/doc)
 *
 * A list of other modules can be found at [github.com/neostd/js](https://github.com/neostd/js)
 *
 * ## Installation
 *
 * ```bash
 * # Deno
 * deno add jsr:@neostd/path
 *
 * # npm from jsr
 * npx jsr add @neostd/path
 *
 * # from npmjs.org
 * npm install @neostd/path
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { resolve, join, isAbsolute, basename, dirname } from "@neostd/path";
 *
 * console.log(isAbsolute("./test"));
 *
 * const dir = resolve("./test");
 * const file = join(dir, "text.txt");
 * console.log(dir);
 * console.log(isAbsolute(dir));
 * console.log(file);
 * console.log(dirname(file));
 * console.log(basename(file))
 *
 * ```
 *
 * ## Functions
 *
 * - **basename** - Return the last portion of a path.
 * - **common** - Determines the common path from a set of paths for the given OS.
 * - **dirname** - Return the directory path of a path.
 * - **extname** - Return the extension of the path with leading period (".").
 * - **format** - Generate a path from a ParsedPath object.
 * - **fromFileUrl** - Converts a file URL to a path string.
 * - **globToRegexp** - Converts a glob string to a regular expression.
 * - **isAbsolute** - Verifies whether provided path is absolute.
 * - **isGlob** - Test whether the given string is a glob.
 * - **joinGlobs** - Joins a sequence of globs, then normalizes the resulting glob.
 * - **join** - Joins a sequence of paths, then normalizes the resulting path.
 * - **normalizeGlob** - Normalizes a glob string.
 * - **normalize** - Normalize the path, resolving `'..'` and `'.'` segments.
 * - **parse** - Return an object containing the parsed components of the path.
 * - **relative** - Return the relative path from `from` to `to` based on current working direct.
 * - **resolve** -  Resolves path segments into a path.
 * - **toFileUrl** - Converts a path string to a file URL.
 * - **toNamespacedPath** - Resolves path to a namespace path.  This is a no-op on non-windows systems.
 *
 * ## Notes
 *
 * @neostd/path is repackaging @neostd/path to enable it for node/bun and avoid a depdendency on jsr
 * when shipping @neostd modules to npm avoid issues with shimming between @neostd/path
 * and `node:path` and include the extra methods such as `toFileUrl` and `fromFileUrl`.
 *
 * ## License
 *
 * [MIT License](./LICENSE.md)
 *
 * @module
 */
export * from "./basename.ts";
export * from "./constants.ts";
export * from "./dirname.ts";
export * from "./extname.ts";
export * from "./format.ts";
export * from "./from-file-url.ts";
export * from "./is-absolute.ts";
export * from "./join.ts";
export * from "./normalize.ts";
export * from "./parse.ts";
export * from "./relative.ts";
export * from "./resolve.ts";
export * from "./to-file-url.ts";
export * from "./to-namespaced-path.ts";
export * from "./common.ts";
export * from "./types.ts";
export * from "./glob-to-regexp.ts";
export * from "./is-glob.ts";
export * from "./join-globs.ts";
export * from "./normalize-glob.ts";
