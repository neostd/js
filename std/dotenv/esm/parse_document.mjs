import { DotEnvDocument } from "./document.mjs";
import {
  CHAR_0,
  CHAR_9,
  CHAR_BACKWARD_SLASH,
  CHAR_CARRIAGE_RETURN,
  CHAR_DOLLAR,
  CHAR_DOUBLE_QUOTE,
  CHAR_EQUAL,
  CHAR_GRAVE_ACCENT,
  CHAR_HASH,
  CHAR_LINE_FEED,
  CHAR_LOWERCASE_A,
  CHAR_LOWERCASE_Z,
  CHAR_SINGLE_QUOTE,
  CHAR_SPACE,
  CHAR_TAB,
  CHAR_UNDERSCORE,
  CHAR_UPPERCASE_A,
  CHAR_UPPERCASE_Z,
} from "@neostd/chars/constants";
import { StringBuilder } from "@neostd/strings/string-builder";
import { isSpace } from "@neostd/chars/is-space";
//#region src/parse_document.ts
/**
 * The `parse-document` module provides functionality to parse a dotenv-style
 * document string into a structured representation. It handles comments,
 * key-value pairs, and quoted values, allowing for a flexible and robust
 * parsing of environment variable definitions.
 *
 * @module
 */
const CHAR_N = 110;
const CHAR_R = 114;
const CHAR_T = 116;
const CHAR_B = 98;
const CHAR_LOWERCASE_U = 117;
const CHAR_UPPERCASE_U = 85;
const CHAR_OPEN_PAREN = 40;
const CHAR_CLOSE_PAREN = 41;
const CHAR_BACKSPACE = 8;
/**
 * Checks if a character code is a valid hexadecimal digit.
 */
function isHexDigit(charCode) {
  return (
    (charCode >= CHAR_0 && charCode <= CHAR_9) ||
    (charCode >= CHAR_UPPERCASE_A && charCode <= 70) ||
    (charCode >= CHAR_LOWERCASE_A && charCode <= 102)
  );
}
/**
 * Parses a hexadecimal string to a number.
 */
function parseHex(hex) {
  return parseInt(hex, 16);
}
/**
 * Parses the given content string as a dotenv document.
 *
 * This function processes the content line by line, handling comments,
 * key-value pairs, and quoted values. It supports different types of quotes
 * (single, double, and backtick) and allows for escaped characters within
 * quoted values.
 *
 * Escape sequences supported in double quotes and backticks:
 * - \n - newline
 * - \r - carriage return
 * - \t - tab
 * - \b - backspace
 * - \\ - backslash
 * - \" - double quote (in double-quoted strings)
 * - \' - single quote (in single-quoted strings)
 * - \` - backtick (in backtick-quoted strings)
 * - \uXXXX - 4-digit unicode escape
 * - \UXXXXXXXX - 8-digit unicode escape
 *
 * Single quotes only escape \' - all other backslash sequences are literal.
 *
 * Command substitution: $(...) in double-quoted strings preserves inner quotes.
 *
 * @param content - The content string to be parsed.
 * @returns A DotEnvDocument object representing the parsed content.
 * @throws Will throw an error if an invalid character is encountered in a key
 *         or if an empty key is found.
 */
function parseDocument(content) {
  const sb = new StringBuilder();
  let quote = 0;
  let inValue = false;
  let line = 1;
  const last = content.length - 1;
  let key = "";
  const doc = new DotEnvDocument();
  let commandSubDepth = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    if (!inValue) {
      if (char === CHAR_HASH && sb.length === 0) {
        let commentStarted = false;
        let commentEnded = false;
        while (i < last) {
          const next = content.charCodeAt(i + 1);
          if (next === CHAR_LINE_FEED) {
            line++;
            i++;
            doc.comment(sb.toString());
            sb.clear();
            commentEnded = true;
            break;
          }
          if (next === CHAR_CARRIAGE_RETURN) {
            if (i < last && content.charCodeAt(i + 2) === CHAR_LINE_FEED) i++;
            line++;
            i++;
            doc.comment(sb.toString());
            sb.clear();
            commentEnded = true;
            break;
          }
          if (!commentStarted && isSpace(next)) {
            i++;
            continue;
          }
          commentStarted = true;
          sb.appendChar(next);
          i++;
        }
        if (!commentEnded && sb.length > 0) {
          doc.comment(sb.toString());
          sb.clear();
        } else if (!commentEnded && !commentStarted) doc.comment("");
        continue;
      }
      if (char === CHAR_LINE_FEED) {
        if (sb.length === 0) {
          line++;
          doc.newline();
          continue;
        }
        doc.item(sb.toString(), "");
        sb.clear();
        line++;
        continue;
      }
      if (char === CHAR_CARRIAGE_RETURN) {
        if (i < last && content.charCodeAt(i + 1) === CHAR_LINE_FEED) i++;
        if (sb.length === 0) {
          line++;
          doc.newline();
          continue;
        }
        doc.item(sb.toString(), "");
        sb.clear();
        line++;
        continue;
      }
      if (isSpace(char)) {
        if (i === last && sb.length === 0) {
          doc.newline();
          break;
        }
        continue;
      }
      if (char === CHAR_EQUAL) {
        if (sb.length === 0) throw new Error("Empty key on line " + line);
        inValue = true;
        key = sb.toString();
        sb.clear();
        continue;
      }
      if (
        char === CHAR_UNDERSCORE ||
        (char >= CHAR_UPPERCASE_A && char <= CHAR_UPPERCASE_Z) ||
        (char >= CHAR_LOWERCASE_A && char <= CHAR_LOWERCASE_Z) ||
        (char >= CHAR_0 && char <= CHAR_9)
      ) {
        sb.appendChar(char);
        continue;
      }
      throw new Error(`Invalid character ${String.fromCharCode(char)} for the key on line ${line}`);
    }
    if (sb.length === 0 && quote === 0) {
      if (char === CHAR_SPACE || char === CHAR_TAB) continue;
      if (char === CHAR_DOUBLE_QUOTE) {
        quote = 2;
        commandSubDepth = 0;
        continue;
      }
      if (char === CHAR_SINGLE_QUOTE) {
        quote = 1;
        continue;
      }
      if (char === CHAR_GRAVE_ACCENT) {
        quote = 3;
        continue;
      }
      if (char === CHAR_LINE_FEED) {
        doc.item(key, "");
        line++;
        inValue = false;
        continue;
      }
      if (char === CHAR_CARRIAGE_RETURN) {
        if (i < last && content.charCodeAt(i + 1) === CHAR_LINE_FEED) i++;
        doc.item(key, "");
        line++;
        inValue = false;
        continue;
      }
    }
    if (char === CHAR_BACKWARD_SLASH && quote !== 0 && quote !== 4) {
      if (i < last) {
        const next = content.charCodeAt(i + 1);
        if (quote === 1) {
          if (next === CHAR_SINGLE_QUOTE) {
            sb.appendChar(CHAR_SINGLE_QUOTE);
            i++;
            continue;
          }
          sb.appendChar(char);
          continue;
        }
        switch (next) {
          case CHAR_N:
            sb.appendChar(CHAR_LINE_FEED);
            i++;
            continue;
          case CHAR_R:
            sb.appendChar(CHAR_CARRIAGE_RETURN);
            i++;
            continue;
          case CHAR_T:
            sb.appendChar(CHAR_TAB);
            i++;
            continue;
          case CHAR_B:
            sb.appendChar(CHAR_BACKSPACE);
            i++;
            continue;
          case CHAR_BACKWARD_SLASH:
            sb.appendChar(CHAR_BACKWARD_SLASH);
            i++;
            continue;
          case CHAR_DOUBLE_QUOTE:
            sb.appendChar(CHAR_DOUBLE_QUOTE);
            i++;
            continue;
          case CHAR_SINGLE_QUOTE:
            sb.appendChar(CHAR_SINGLE_QUOTE);
            i++;
            continue;
          case CHAR_GRAVE_ACCENT:
            sb.appendChar(CHAR_GRAVE_ACCENT);
            i++;
            continue;
          case CHAR_LOWERCASE_U:
            if (i + 5 <= last) {
              let valid = true;
              for (let j = 2; j <= 5; j++)
                if (!isHexDigit(content.charCodeAt(i + j))) {
                  valid = false;
                  break;
                }
              if (valid) {
                const codePoint = parseHex(content.slice(i + 2, i + 6));
                sb.appendChar(codePoint);
                i += 5;
                continue;
              }
            }
            sb.appendChar(char);
            continue;
          case CHAR_UPPERCASE_U:
            if (i + 9 <= last) {
              let valid = true;
              for (let j = 2; j <= 9; j++)
                if (!isHexDigit(content.charCodeAt(i + j))) {
                  valid = false;
                  break;
                }
              if (valid) {
                const codePoint = parseHex(content.slice(i + 2, i + 10));
                sb.appendChar(codePoint);
                i += 9;
                continue;
              }
            }
            sb.appendChar(char);
            continue;
          default:
            sb.appendChar(char);
            continue;
        }
      }
    }
    if (quote === 4) {
      if (char === CHAR_LINE_FEED) {
        if (key.length > 0) doc.item(key, sb.toString());
        sb.clear();
        line++;
        inValue = false;
        quote = 0;
        continue;
      }
      if (char === CHAR_CARRIAGE_RETURN) {
        if (i < last && content.charCodeAt(i + 1) === CHAR_LINE_FEED) i++;
        if (key.length > 0) doc.item(key, sb.toString());
        sb.clear();
        line++;
        inValue = false;
        quote = 0;
        continue;
      }
      if (char === CHAR_HASH) {
        while (i < last) {
          const next = content.charCodeAt(i + 1);
          if (next === CHAR_LINE_FEED || next === CHAR_CARRIAGE_RETURN) break;
          i++;
        }
        continue;
      }
      if (isSpace(char)) continue;
      console.log(doc.toArray());
      throw new Error(
        `Invalid character ${String.fromCharCode(char)} for the value on line ${line}. If you need to include spaces, use quotes.`,
      );
    }
    if (quote !== 0) {
      if (quote === 2) {
        if (char === CHAR_DOLLAR && i < last && content.charCodeAt(i + 1) === CHAR_OPEN_PAREN) {
          commandSubDepth++;
          sb.appendChar(char);
          continue;
        }
        if (char === CHAR_CLOSE_PAREN && commandSubDepth > 0) {
          commandSubDepth--;
          sb.appendChar(char);
          continue;
        }
        if (commandSubDepth > 0) {
          if (char === CHAR_LINE_FEED) {
            sb.appendChar(char);
            line++;
            continue;
          }
          if (char === CHAR_CARRIAGE_RETURN) {
            sb.appendChar(char);
            if (i < last && content.charCodeAt(i + 1) === CHAR_LINE_FEED) {
              i++;
              sb.appendChar(CHAR_LINE_FEED);
            }
            line++;
            continue;
          }
          sb.appendChar(char);
          continue;
        }
      }
      if (
        (quote === 2 && char === CHAR_DOUBLE_QUOTE) ||
        (quote === 1 && char === CHAR_SINGLE_QUOTE) ||
        (quote === 3 && char === CHAR_GRAVE_ACCENT)
      ) {
        quote = 4;
        doc.item(key, sb.toString());
        sb.clear();
        key = "";
        continue;
      }
      if (char === CHAR_LINE_FEED) {
        sb.appendChar(char);
        line++;
        continue;
      }
      if (char === CHAR_CARRIAGE_RETURN) {
        sb.appendChar(char);
        if (i < last && content.charCodeAt(i + 1) === CHAR_LINE_FEED) i++;
        sb.appendChar(content.charCodeAt(i));
        line++;
        continue;
      }
      sb.appendChar(char);
      continue;
    }
    if (char === CHAR_HASH) {
      const value = sb.toString().trimEnd();
      doc.item(key, value);
      sb.clear();
      key = "";
      inValue = false;
      while (i < last) {
        const next = content.charCodeAt(i + 1);
        if (next === CHAR_LINE_FEED) {
          line++;
          i++;
          break;
        }
        if (next === CHAR_CARRIAGE_RETURN) {
          if (i + 1 < last && content.charCodeAt(i + 2) === CHAR_LINE_FEED) i++;
          line++;
          i++;
          break;
        }
        i++;
      }
      continue;
    }
    if (char === CHAR_LINE_FEED) {
      doc.item(key, sb.toString().trimEnd());
      sb.clear();
      key = "";
      line++;
      inValue = false;
      quote = 0;
      continue;
    }
    if (char === CHAR_CARRIAGE_RETURN) {
      if (i < last && content.charCodeAt(i + 1) === CHAR_LINE_FEED) i++;
      doc.item(key, sb.toString().trimEnd());
      key = "";
      sb.clear();
      line++;
      quote = 0;
      inValue = false;
      continue;
    }
    if (isSpace(char)) {
      sb.appendChar(char);
      continue;
    }
    sb.appendChar(char);
  }
  if (inValue) {
    if (key !== "") doc.item(key, sb.toString().trimEnd());
  } else if (sb.length > 0) doc.item(sb.toString(), "");
  return doc;
}
//#endregion
export { parseDocument };
