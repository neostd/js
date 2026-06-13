// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.

import { common as _common } from "../common/common.ts";
import { SEPARATOR } from "./constants.ts";

/** Determines the common path from a set of paths for POSIX systems.
 *
 * @example Usage
 * ```ts
 * import { common } from "@neostd/path/posix/common";
 * import { equal } from "node:assert/strict";
 *
 * const path = common([
 *   "./deno/std/path/index.ts",
 *   "./deno/std/fs/index.ts",
 * ]);
 * equal(path, "./deno/std/");
 * ```
 *
 * @param paths The paths to compare.
 * @returns The common path.
 */
export function common(paths: string[]): string {
  return _common(paths, SEPARATOR);
}
