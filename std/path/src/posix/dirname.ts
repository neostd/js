// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.

import { assertArg } from "../common/dirname.ts";
import { stripTrailingSeparators } from "../common/strip-trailing-separators.ts";
import { isPosixPathSeparator } from "./util.ts";
import { fromFileUrl } from "./from-file-url.ts";

/**
 * Return the directory path of a `path`.
 *
 * @example Usage
 * ```ts
 * import { dirname } from "@neostd/path/posix/dirname";
 * import { equal } from "node:assert/strict";
 *
 * equal(dirname("/home/user/Documents/"), "/home/user");
 * equal(dirname("/home/user/Documents/image.png"), "/home/user/Documents");
 * equal(dirname("https://deno.land/std/path/index.ts"), "https://deno.land/std/path");
 * ```
 *
 * @example Working with URLs
 *
 * ```ts
 * import { dirname } from "@neostd/path/posix/dirname";
 * import { equal } from "node:assert/strict";
 *
 * equal(dirname("https://deno.land/std/path/index.ts"), "https://deno.land/std/path");
 * equal(dirname("https://deno.land/std/path/index.ts?a=b"), "https://deno.land/std/path");
 * equal(dirname("https://deno.land/std/path/index.ts#header"), "https://deno.land/std/path");
 * ```
 *
 * Note: If you are working with file URLs,
 * use the new version of `dirname` from `@neostd/path/posix/unstable-dirname`.
 *
 * @param path The path to get the directory from.
 * @returns The directory path.
 */
export function dirname(path: string | URL): string {
  if (path instanceof URL) {
    path = fromFileUrl(path);
  }
  assertArg(path);

  let end = -1;
  let matchedNonSeparator = false;

  for (let i = path.length - 1; i >= 1; --i) {
    if (isPosixPathSeparator(path.charCodeAt(i))) {
      if (matchedNonSeparator) {
        end = i;
        break;
      }
    } else {
      matchedNonSeparator = true;
    }
  }

  // No matches. Fallback based on provided path:
  //
  // - leading slashes paths
  //     "/foo" => "/"
  //     "///foo" => "/"
  // - no slash path
  //     "foo" => "."
  if (end === -1) {
    return isPosixPathSeparator(path.charCodeAt(0)) ? "/" : ".";
  }

  return stripTrailingSeparators(path.slice(0, end), isPosixPathSeparator);
}
