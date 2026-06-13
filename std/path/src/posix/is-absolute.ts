// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.

import { assertPath } from "../common/assert-path.ts";
import { isPosixPathSeparator } from "./util.ts";

/**
 * Verifies whether provided path is absolute.
 *
 * @example Usage
 * ```ts
 * import { isAbsolute } from "@neostd/path/posix/is-absolute";
 * import { assert, assertFalse } from "node:assert/strict";
 *
 * assert(isAbsolute("/home/user/Documents/"));
 * assertFalse(isAbsolute("home/user/Documents/"));
 * ```
 *
 * @param path The path to verify.
 * @returns Whether the path is absolute.
 */
export function isAbsolute(path: string): boolean {
  assertPath(path);
  return path.length > 0 && isPosixPathSeparator(path.charCodeAt(0));
}
