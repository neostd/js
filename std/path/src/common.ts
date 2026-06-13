// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.

import { common as _common } from "./common/common.ts";
import { SEPARATOR } from "./constants.ts";

/**
 * Determines the common path from a set of paths for the given OS.
 *
 * @param paths Paths to search for common path.
 * @returns The common path.
 *
 * @example Usage
 * ```ts
 * import { common } from "@neostd/path/common";
 * import { equal } from "node:assert/strict";
 *
 * if (Deno.build.os === "windows") {
 *   const path = common([
 *     "C:\\deno\\std\\path\\index.ts",
 *     "C:\\deno\\std\\fs\\index.ts"
 *   ]);
 *   equal(path, "C:\\deno\\std\\");
 * } else {
 *   const path = common([
 *     "./deno/std/path/index.ts",
 *     "./deno/std/fs/index.ts"
 *   ]);
 *   equal(path, "./deno/std/");
 * }
 * ```
 */
export function common(paths: string[]): string {
  return _common(paths, SEPARATOR);
}
