const WINDOWS = typeof process !== "undefined" && process.platform === "win32";

function toCharArray(value: string): number[] {
  return Array.from(value, (char) => char.codePointAt(0) ?? 0);
}

function isSpace(code: number): boolean {
  return code === 32 || code === 9 || code === 10 || code === 11 || code === 12 || code === 13;
}

function containsWindowsSpecialChars(value: string): { found: boolean; codePoints?: number[] } {
  const chars = toCharArray(value);
  for (const char of chars) {
    if (char === 32 || char === 34) {
      return { found: true };
    }
  }

  return { found: false, codePoints: chars };
}

function containsSpecialChars(value: string): { found: boolean; codePoints?: number[] } {
  const chars = toCharArray(value);
  for (const char of chars) {
    if (char === 36 || char === 96 || char === 34 || char === 92 || char === 39 || isSpace(char)) {
      return { found: true };
    }
  }

  return { found: false, codePoints: chars };
}

/**
 * Joins command arguments into a Windows-compatible command string.
 *
 * Arguments containing spaces or double quotes are wrapped in double quotes. Backslashes before quotes are escaped using
 * Windows command-line quoting rules.
 *
 * @param args Command arguments to join.
 * @returns A Windows-compatible command string.
 *
 * @example
 * ```ts
 * windowsJoin(["cmd", "C:\\Program Files\\app.exe"]);
 * // 'cmd "C:\\Program Files\\app.exe"'
 * ```
 */
export function windowsJoin(args: string[]): string {
  const buffer: number[] = [];
  for (const arg of args) {
    if (buffer.length > 0) {
      buffer.push(32);
    }

    const { found, codePoints } = containsWindowsSpecialChars(arg);
    if (!found) {
      buffer.push(...(codePoints ?? []));
      continue;
    }

    let backslashCount = 0;
    buffer.push(34);

    for (const char of toCharArray(arg)) {
      if (char === 92) {
        backslashCount += 1;
        continue;
      }

      if (char === 34) {
        buffer.push(...Array(2 * backslashCount + 1).fill(92));
        backslashCount = 0;
        buffer.push(34);
        continue;
      }

      if (backslashCount > 0) {
        buffer.push(...Array(backslashCount).fill(92));
        backslashCount = 0;
      }

      buffer.push(char);
    }

    if (backslashCount > 0) {
      buffer.push(...Array(backslashCount).fill(92));
    }

    buffer.push(34);
  }

  return String.fromCodePoint(...buffer);
}

/**
 * Joins command arguments into a Unix-compatible command string.
 *
 * Arguments containing shell-special characters are wrapped in double quotes. Dollar signs, backticks, double quotes,
 * and backslashes are escaped inside quoted arguments.
 *
 * @param args Command arguments to join.
 * @returns A Unix-compatible command string.
 *
 * @example
 * ```ts
 * unixJoin(["echo", "$HOME"]);
 * // 'echo "\\$HOME"'
 * ```
 */
export function unixJoin(args: string[]): string {
  const buffer: number[] = [];
  for (const arg of args) {
    if (buffer.length > 0) {
      buffer.push(32);
    }

    const { found, codePoints } = containsSpecialChars(arg);
    if (!found) {
      buffer.push(...(codePoints ?? []));
      continue;
    }

    buffer.push(34);
    for (const char of toCharArray(arg)) {
      if (char === 36 || char === 96 || char === 34 || char === 92) {
        buffer.push(92);
      }
      buffer.push(char);
    }
    buffer.push(34);
  }

  return String.fromCodePoint(...buffer);
}

/**
 * Joins command arguments into a platform-appropriate command string.
 *
 * Uses {@linkcode windowsJoin} on Windows and {@linkcode unixJoin} elsewhere.
 *
 * @param args Command arguments to join.
 * @returns A command string escaped for the current platform.
 */
export function join(args: string[]): string {
  return WINDOWS ? windowsJoin(args) : unixJoin(args);
}
