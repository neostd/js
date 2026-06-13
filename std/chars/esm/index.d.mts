import { isAscii } from "./is-ascii.mjs";
import { isChar } from "./is-char.mjs";
import { t as Char } from "./types-CzHdav0e.mjs";
import { isControl } from "./is-control.mjs";
import { isDigit } from "./is-digit.mjs";
import { isLatin1 } from "./is-latin1.mjs";
import { isLetter } from "./is-letter.mjs";
import { isLetterOrDigit } from "./is-letter-or-digit.mjs";
import { isLower } from "./is-lower.mjs";
import { isPunc } from "./is-punc.mjs";
import { isSpace } from "./is-space.mjs";
import { isSymbol } from "./is-symbol.mjs";
import { isUpper } from "./is-upper.mjs";
import { equalFold, simpleFold } from "./simple-fold.mjs";
import { toLower } from "./to-lower.mjs";
import { toUpper } from "./to-upper.mjs";

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
export {
  Char,
  _default as default,
  equalFold,
  isAscii,
  isChar,
  isControl,
  isDigit,
  isLatin1,
  isLetter,
  isLetterOrDigit,
  isLower,
  isPunc,
  isSpace,
  isSymbol,
  isUpper,
  simpleFold,
  toLower,
  toUpper,
};
