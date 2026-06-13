const CHAR_BACKWARD_SLASH = 92;
const CHAR_CARRIAGE_RETURN = 13;
const CHAR_DOUBLE_QUOTE = 34;
const CHAR_GRAVE_ACCENT = 96;
const CHAR_LINE_FEED = 10;
const CHAR_SINGLE_QUOTE = 39;
const CHAR_SPACE = 32;

function toCharArray(value: string): number[] {
  return Array.from(value, (char) => char.codePointAt(0) ?? 0);
}

/**
 * Splits a command-line string into an array of arguments.
 *
 * Handles space-separated arguments, single-quoted strings, double-quoted strings, escaped quotes inside quoted
 * strings, and line continuations with `\` or PowerShell-style backticks.
 *
 * @param value Command-line string to split.
 * @returns Argument tokens.
 *
 * @example
 * ```ts
 * split('git commit -m "initial commit"');
 * // ["git", "commit", "-m", "initial commit"]
 * ```
 */
export function split(value: string): string[] {
  const Quote = {
    None: 0,
    Single: 1,
    Double: 2,
  } as const;

  let quote: number = Quote.None;
  const tokens: string[] = [];
  const buffer: number[] = [];
  const chars = toCharArray(value);

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    if (quote > Quote.None) {
      if (
        (char === CHAR_SINGLE_QUOTE || char === CHAR_DOUBLE_QUOTE) &&
        chars[i - 1] === CHAR_BACKWARD_SLASH
      ) {
        buffer.pop();
        buffer.push(char);
        continue;
      }

      if (quote === Quote.Single && char === CHAR_SINGLE_QUOTE) {
        quote = Quote.None;
        if (buffer.length > 0) {
          tokens.push(String.fromCodePoint(...buffer));
        }
        buffer.length = 0;
        continue;
      }

      if (quote === Quote.Double && char === CHAR_DOUBLE_QUOTE) {
        quote = Quote.None;
        if (buffer.length > 0) {
          tokens.push(String.fromCodePoint(...buffer));
        }
        buffer.length = 0;
        continue;
      }

      buffer.push(char);
      continue;
    }

    if (char === CHAR_SPACE) {
      const remaining = chars.length - 1 - i;
      if (remaining > 2) {
        const next = chars[i + 1];
        const nextNext = chars[i + 2];
        if (
          (next === CHAR_BACKWARD_SLASH || next === CHAR_GRAVE_ACCENT) &&
          nextNext === CHAR_LINE_FEED
        ) {
          i += 2;
          if (buffer.length > 0) {
            tokens.push(String.fromCodePoint(...buffer));
          }
          buffer.length = 0;
          continue;
        }

        if (remaining > 3 && (next === CHAR_BACKWARD_SLASH || next === CHAR_GRAVE_ACCENT)) {
          const third = chars[i + 3];
          if (nextNext === CHAR_CARRIAGE_RETURN && third === CHAR_LINE_FEED) {
            i += 3;
            if (buffer.length > 0) {
              tokens.push(String.fromCodePoint(...buffer));
            }
            buffer.length = 0;
            continue;
          }
        }
      }

      if (buffer.length > 0) {
        tokens.push(String.fromCodePoint(...buffer));
      }
      buffer.length = 0;
      continue;
    }

    if (char === CHAR_BACKWARD_SLASH) {
      const next = chars[i + 1];
      if (next === CHAR_SPACE || next === CHAR_SINGLE_QUOTE || next === CHAR_DOUBLE_QUOTE) {
        buffer.push(char, next);
        i += 1;
        continue;
      }

      buffer.push(char);
      continue;
    }

    if (buffer.length === 0 && (char === CHAR_SINGLE_QUOTE || char === CHAR_DOUBLE_QUOTE)) {
      if (i > 0 && chars[i - 1] === CHAR_BACKWARD_SLASH) {
        buffer.push(char);
        continue;
      }

      quote = char === CHAR_SINGLE_QUOTE ? Quote.Single : Quote.Double;
      continue;
    }

    buffer.push(char);
  }

  if (buffer.length > 0) {
    tokens.push(String.fromCodePoint(...buffer));
  }

  return tokens;
}
