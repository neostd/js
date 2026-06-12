import { isAscii } from "./is_ascii.mjs";
import { isChar } from "./is_char.mjs";
import { t as Char } from "./types-CzHdav0e.mjs";
import { isControl } from "./is_control.mjs";
import { isDigit } from "./is_digit.mjs";
import { isLatin1 } from "./is_latin1.mjs";
import { isLetter } from "./is_letter.mjs";
import { isLetterOrDigit } from "./is_letter_or_digit.mjs";
import { isLower } from "./is_lower.mjs";
import { isPunc } from "./is_punc.mjs";
import { isSpace } from "./is_space.mjs";
import { isSymbol } from "./is_symbol.mjs";
import { isUpper } from "./is_upper.mjs";
import { equalFold, simpleFold } from "./simple_fold.mjs";
import { toLower } from "./to_lower.mjs";
import { toUpper } from "./to_upper.mjs";

//#region src/index.d.ts
declare const _default: {
  equalFold: typeof equalFold;
  isAscii: typeof isAscii;
  isChar: typeof isChar;
  isControl: typeof isControl;
  isDigit: typeof isDigit;
  isLatin1: typeof isLatin1;
  isLetter: typeof isLetter;
  isLetterOrDigit: typeof isLetterOrDigit;
  isLower: typeof isLower;
  isPunc: typeof isPunc;
  isSpace: typeof isSpace;
  isSymbol: typeof isSymbol;
  simpleFold: typeof simpleFold;
  toLower: typeof toLower;
  toUpper: typeof toUpper;
};
//#endregion
export { Char, _default as default, equalFold, isAscii, isChar, isControl, isDigit, isLatin1, isLetter, isLetterOrDigit, isLower, isPunc, isSpace, isSymbol, isUpper, simpleFold, toLower, toUpper };