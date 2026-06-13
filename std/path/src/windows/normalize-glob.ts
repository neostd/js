// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.

import type { GlobOptions } from "../common/glob-to-reg-exp.ts";
import { normalize } from "./normalize.ts";
import { SEPARATOR_PATTERN } from "./constants.ts";

export type { GlobOptions };

const NULL_MARKER = "\u0000";

/**
 * Like normalize(), but doesn't collapse "**\/.." when `globstar` is true.
 *
 * @example Usage
 * ```ts
 * import { normalizeGlob } from "@neostd/path/windows/normalize-glob";
 * import { equal } from "node:assert/strict";
 *
 * const normalized = normalizeGlob("**\\foo\\..\\bar", { globstar: true });
 * equal(normalized, "**\\bar");
 * ```
 *
 * @param glob The glob pattern to normalize.
 * @param options The options for glob pattern.
 * @throws Error if the glob contains invalid characters.
 * @returns The normalized glob pattern.
 */
export function normalizeGlob(glob: string, options: Pick<GlobOptions, "globstar"> = {}): string {
  const { globstar = false }: GlobOptions = options;
  if (glob.includes(NULL_MARKER)) {
    throw new Error(`Glob contains invalid characters: "${glob}"`);
  }
  if (!globstar) {
    return normalize(glob);
  }
  const s = SEPARATOR_PATTERN.source;
  const badParentPattern = new RegExp(`(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`, "g");
  return normalize(glob.replace(badParentPattern, NULL_MARKER)).replaceAll(NULL_MARKER, "..");
}
