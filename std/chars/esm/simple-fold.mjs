import { n as CaseOrbit, t as AsciiFold } from "./case-BgNeCTGR.mjs";
import { toLower } from "./to-lower.mjs";
import { toUpper } from "./to-upper.mjs";
//#region src/simple-fold.ts
/**
 * Returns the simple case folding of the given character. Based on
 * golang's unicode/simplefold.go implementation.
 * @param char The character to fold.
 * @returns The folded character.
 *
 * @example
 * ```ts
 * import { simpleFold } from "@neostd/chars";
 *
 * console.log(String.fromCharCode(simpleFold(0x41))); // 'a'
 * console.log(String.fromCharCode(simpleFold(0x61))); // 'A'
 * console.log(String.fromCharCode(simpleFold(0xDF))); // 's'
 * console.log(String.fromCharCode(simpleFold(0x73))); // 'ß'
 * console.log(String.fromCharCode(simpleFold(0x1F88))); // 'ᾀ'
 * console.log(String.fromCharCode(simpleFold(0x1F80))); // 'ᾈ'
 * ```
 */
function simpleFold(char) {
  if (char < 0 || char > 1114111) return char;
  if (char < AsciiFold.length) return AsciiFold[char];
  let lo = 0;
  let hi = CaseOrbit.length;
  while (lo < hi) {
    const m = (lo + hi) >>> 1;
    if (CaseOrbit[m][0] < char) lo = m + 1;
    else hi = m;
  }
  if ((lo < CaseOrbit.length && CaseOrbit[lo][0]) === char) return CaseOrbit[lo][1];
  const l = toLower(char);
  if (l != char) return l;
  return toUpper(char);
}
/**
 * Compares two characters for equality under simple case folding
 * which is a more general form of case-insensitivity.
 *
 * @param a The first character to compare.
 * @param b The second character to compare.
 * @returns `true` if the characters are equal under simple cas
 * folding, `false` otherwise.
 *
 * @example
 * ```ts
 * import { equalFold } from "@neostd/chars";
 *
 * console.log(equalFold(0x41, 0x61)); // true ('A' and 'a')
 * console.log(equalFold(0xDF, 0x73)); // true ('ß' and 's')
 * console.log(equalFold(0x1F88, 0x1F80)); // true ('ᾈ' and 'ᾀ')
 * console.log(equalFold(0x41, 0x42)); // false ('A' and 'B')
 * ```
 */
function equalFold(a, b) {
  if (a === b) return true;
  if (a < 128 && b < 128) {
    if (a >= 65 && a <= 90) a += 32;
    if (b >= 65 && b <= 90) b += 32;
    return a === b;
  }
  return simpleFold(a) === b;
}
//#endregion
export { equalFold, simpleFold };
