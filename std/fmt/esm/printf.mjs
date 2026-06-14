import { globals } from "./globals.mjs";
import { inspect } from "./inspect.mjs";
import { stripAnsiCode } from "./strip_ansi_code.mjs";
import { stdout } from "@neostd/process/streams";
import { args } from "@neostd/process/args";
//#region src/printf.ts
/**
 * {@linkcode sprintf} and {@linkcode printf} for printing formatted strings to
 * stdout.
 *
 * ```ts
 * import { sprintf } from "@std/fmt/printf";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(sprintf("%d", 9), "9");
 * assertEquals(sprintf("%o", 9), "11");
 * assertEquals(sprintf("%f", 4), "4.000000");
 * assertEquals(sprintf("%.3f", 0.9999), "1.000");
 * ```
 *
 * This implementation is inspired by POSIX and Golang but does not port
 * implementation code.
 *
 * sprintf converts and formats a variable number of arguments as is specified
 * by a `format string`. In it's basic form, a format string may just be a
 * literal. In case arguments are meant to be formatted, a `directive` is
 * contained in the format string, preceded by a '%' character:
 *
 *     %<verb>
 *
 * E.g. the verb `s` indicates the directive should be replaced by the string
 * representation of the argument in the corresponding position of the argument
 * list. E.g.:
 *
 *     Hello %s!
 *
 * applied to the arguments "World" yields "Hello World!".
 *
 * The meaning of the format string is modelled after [POSIX][1] format strings
 * as well as well as [Golang format strings][2]. Both contain elements specific
 * to the respective programming language that don't apply to JavaScript, so
 * they can not be fully supported. Furthermore we implement some functionality
 * that is specific to JS.
 *
 * ## Verbs
 *
 * The following verbs are supported:
 *
 * | Verb  | Meaning                                                        |
 * | ----- | -------------------------------------------------------------- |
 * | `%`   | print a literal percent                                        |
 * | `t`   | evaluate arg as boolean, print `true` or `false`               |
 * | `b`   | eval as number, print binary                                   |
 * | `c`   | eval as number, print character corresponding to the codePoint |
 * | `o`   | eval as number, print octal                                    |
 * | `x X` | print as hex (ff FF), treat string as list of bytes            |
 * | `e E` | print number in scientific/exponent format 1.123123e+01        |
 * | `f F` | print number as float with decimal point and no exponent       |
 * | `g G` | use %e %E or %f %F depending on size of argument               |
 * | `s`   | interpolate string                                             |
 * | `T`   | type of arg, as returned by `typeof`                           |
 * | `v`   | value of argument in 'default' format (see below)              |
 * | `j`   | argument as formatted by `JSON.stringify`                      |
 * | `i`   | argument as formatted by `inspect`                             |
 * | `I`   | argument as formatted by `inspect` in compact format           |
 *
 * ## Width and Precision
 *
 * Verbs may be modified by providing them with width and precision, either or
 * both may be omitted:
 *
 *     %9f    width 9, default precision
 *     %.9f   default width, precision 9
 *     %8.9f  width 8, precision 9
 *     %8.f   width 8, precision 0
 *
 * In general, 'width' describes the minimum length of the output, while
 * 'precision' limits the output.
 *
 * | verb      | precision                                                       |
 * | --------- | --------------------------------------------------------------- |
 * | `t`       | n/a                                                             |
 * | `b c o`   | n/a                                                             |
 * | `x X`     | n/a for number, strings are truncated to p bytes(!)             |
 * | `e E f F` | number of places after decimal, default 6                       |
 * | `g G`     | set maximum number of digits                                    |
 * | `s`       | truncate input                                                  |
 * | `T`       | truncate                                                        |
 * | `v`       | truncate, or depth if used with # see "'default' format", below |
 * | `j`       | n/a                                                             |
 *
 * Numerical values for width and precision can be substituted for the `*` char,
 * in which case the values are obtained from the next args, e.g.:
 *
 *     sprintf("%*.*f", 9, 8, 456.0)
 *
 * is equivalent to:
 *
 *     sprintf("%9.8f", 456.0)
 *
 * ## Flags
 *
 * The effects of the verb may be further influenced by using flags to modify
 * the directive:
 *
 * | Flag  | Verb      | Meaning                                                                    |
 * | ----- | --------- | -------------------------------------------------------------------------- |
 * | `+`   | numeric   | always print sign                                                          |
 * | `-`   | all       | pad to the right (left justify)                                            |
 * | `#`   |           | alternate format                                                           |
 * | `#`   | `b o x X` | prefix with `0b 0 0x`                                                      |
 * | `#`   | `g G`     | don't remove trailing zeros                                                |
 * | `#`   | `v`       | use output of `inspect` instead of `toString`                              |
 * | `' '` |           | space character                                                            |
 * | `' '` | `x X`     | leave spaces between bytes when printing string                            |
 * | `' '` | `d`       | insert space for missing `+` sign character                                |
 * | `0`   | all       | pad with zero, `-` takes precedence, sign is appended in front of padding  |
 * | `<`   | all       | format elements of the passed array according to the directive (extension) |
 *
 * ## 'default' format
 *
 * The default format used by `%v` is the result of calling `toString()` on the
 * relevant argument. If the `#` flags is used, the result of calling `inspect()`
 * is interpolated. In this case, the precision, if set is passed to `inspect()`
 * as the 'depth' config parameter.
 *
 * ## Positional arguments
 *
 * Arguments do not need to be consumed in the order they are provided and may
 * be consumed more than once. E.g.:
 *
 *     sprintf("%[2]s %[1]s", "World", "Hello")
 *
 * returns "Hello World". The presence of a positional indicator resets the arg
 * counter allowing args to be reused:
 *
 *     sprintf("dec[%d]=%d hex[%[1]d]=%x oct[%[1]d]=%#o %s", 1, 255, "Third")
 *
 * returns `dec[1]=255 hex[1]=0xff oct[1]=0377 Third`
 *
 * Width and precision my also use positionals:
 *
 *     "%[2]*.[1]*d", 1, 2
 *
 * This follows the golang conventions and not POSIX.
 *
 * ## Errors
 *
 * The following errors are handled:
 *
 * Incorrect verb:
 *
 *     S("%h", "") %!(BAD VERB 'h')
 *
 * Too few arguments:
 *
 *     S("%d") %!(MISSING 'd')"
 *
 * [1]: https://pubs.opengroup.org/onlinepubs/009695399/functions/fprintf.html
 * [2]: https://golang.org/pkg/fmt/
 *
 * @module
 */
let platform = "unknown";
let noColorFlag = false;
function setNoColor(noColor) {
  noColorFlag = noColor;
}
if (typeof globals.Deno !== "undefined") {
  platform = globals.Deno.build.os;
  noColorFlag = globals.Deno.noColor;
} else if (globals.process) {
  platform = globals.process.platform;
  if (platform === "win32") platform = "windows";
  noColorFlag =
    globals.process.env.NO_COLOR === "1" ||
    globals.process.env.NO_COLOR === "true" ||
    globals.process.env.COLOR === "0" ||
    globals.process.env.COLOR === "false" ||
    args.includes("--no-color") ||
    args.includes("--color=0") ||
    args.includes("--color=false");
}
const EOL = platform === "windows" ? "\r\n" : "\n";
const State = {
  PASSTHROUGH: 0,
  PERCENT: 1,
  POSITIONAL: 2,
  PRECISION: 3,
  WIDTH: 4,
};
const WorP = {
  WIDTH: 0,
  PRECISION: 1,
};
const F = {
  sign: 1,
  mantissa: 2,
  fractional: 3,
  esign: 4,
  exponent: 5,
};
var Flags = class {
  plus;
  dash;
  sharp;
  space;
  zero;
  lessthan;
  width = -1;
  precision = -1;
};
const min = Math.min;
const UNICODE_REPLACEMENT_CHARACTER = "�";
const DEFAULT_PRECISION = 6;
const FLOAT_REGEXP = /(-?)(\d)\.?(\d*)e([+-])(\d+)/;
var Printf = class {
  format;
  args;
  i;
  state = State.PASSTHROUGH;
  verb = "";
  buf = "";
  argNum = 0;
  flags = new Flags();
  haveSeen;
  tmpError;
  constructor(format, ...args) {
    this.format = format;
    this.args = args;
    this.haveSeen = Array.from({ length: args.length });
    this.i = 0;
  }
  doPrintf() {
    for (; this.i < this.format.length; ++this.i) {
      const c = this.format[this.i];
      switch (this.state) {
        case State.PASSTHROUGH:
          if (c === "%") this.state = State.PERCENT;
          else this.buf += c;
          break;
        case State.PERCENT:
          if (c === "%") {
            this.buf += c;
            this.state = State.PASSTHROUGH;
          } else this.handleFormat();
          break;
        default:
          throw new Error(
            `State ${this.state} should be unreachable, please file a bug report against Deno at https://github.com/denoland/std/issues`,
          );
      }
    }
    let extras = false;
    let err = "%!(EXTRA";
    for (let i = 0; i !== this.haveSeen.length; ++i)
      if (!this.haveSeen[i]) {
        extras = true;
        err += ` '${inspect(this.args[i])}'`;
      }
    err += ")";
    if (extras) this.buf += err;
    return this.buf;
  }
  handleFormat() {
    this.flags = new Flags();
    const flags = this.flags;
    for (; this.i < this.format.length; ++this.i) {
      const c = this.format[this.i];
      switch (this.state) {
        case State.PERCENT:
          switch (c) {
            case "[":
              this.handlePositional();
              this.state = State.POSITIONAL;
              break;
            case "+":
              flags.plus = true;
              break;
            case "<":
              flags.lessthan = true;
              break;
            case "-":
              flags.dash = true;
              flags.zero = false;
              break;
            case "#":
              flags.sharp = true;
              break;
            case " ":
              flags.space = true;
              break;
            case "0":
              flags.zero = !flags.dash;
              break;
            default:
              if (("1" <= c && c <= "9") || c === "." || c === "*") {
                if (c === ".") {
                  this.flags.precision = 0;
                  this.state = State.PRECISION;
                  this.i++;
                } else this.state = State.WIDTH;
                this.handleWidthAndPrecision(flags);
              } else {
                this.handleVerb();
                return;
              }
          }
          break;
        case State.POSITIONAL:
          if (c === "*") {
            const worp = this.flags.precision === -1 ? WorP.WIDTH : WorP.PRECISION;
            this.handleWidthOrPrecisionRef(worp);
            this.state = State.PERCENT;
            break;
          } else {
            this.handleVerb();
            return;
          }
        default:
          throw new Error(
            `State ${this.state} should be unreachable, please file a bug report against Deno at https://github.com/denoland/std/issues`,
          );
      }
    }
  }
  /**
   * Handle width or precision
   * @param wOrP
   */
  handleWidthOrPrecisionRef(wOrP) {
    if (this.argNum >= this.args.length) return;
    const arg = this.args[this.argNum];
    this.haveSeen[this.argNum] = true;
    if (typeof arg === "number")
      switch (wOrP) {
        case WorP.WIDTH:
          this.flags.width = arg;
          break;
        default:
          this.flags.precision = arg;
      }
    else {
      const tmp = wOrP === WorP.WIDTH ? "WIDTH" : "PREC";
      this.tmpError = `%!(BAD ${tmp} '${String(this.args[this.argNum])}')`;
    }
    this.argNum++;
  }
  /**
   * Handle width and precision
   * @param flags
   */
  handleWidthAndPrecision(flags) {
    const fmt = this.format;
    for (; this.i !== this.format.length; ++this.i) {
      const c = fmt[this.i];
      switch (this.state) {
        case State.WIDTH:
          switch (c) {
            case ".":
              this.flags.precision = 0;
              this.state = State.PRECISION;
              break;
            case "*":
              this.handleWidthOrPrecisionRef(WorP.WIDTH);
              break;
            default: {
              const val = parseInt(c);
              if (isNaN(val)) {
                this.i--;
                this.state = State.PERCENT;
                return;
              }
              flags.width = flags.width === -1 ? 0 : flags.width;
              flags.width *= 10;
              flags.width += val;
            }
          }
          break;
        case State.PRECISION: {
          if (c === "*") {
            this.handleWidthOrPrecisionRef(WorP.PRECISION);
            break;
          }
          const val = parseInt(c);
          if (isNaN(val)) {
            this.i--;
            this.state = State.PERCENT;
            return;
          }
          flags.precision *= 10;
          flags.precision += val;
          break;
        }
        default:
          throw new Error(
            `State ${this.state} should be unreachable, please file a bug report against Deno at https://github.com/denoland/std/issues`,
          );
      }
    }
  }
  /** Handle positional */
  handlePositional() {
    if (this.format[this.i] !== "[")
      throw new Error(
        "Should be unreachable, please file a bug report against Deno at https://github.com/denoland/std/issues",
      );
    let positional = 0;
    const format = this.format;
    this.i++;
    let err = false;
    for (; this.i !== this.format.length; ++this.i) {
      if (format[this.i] === "]") break;
      positional *= 10;
      const val = parseInt(format[this.i], 10);
      if (isNaN(val)) {
        this.tmpError = "%!(BAD INDEX)";
        err = true;
      }
      positional += val;
    }
    if (positional - 1 >= this.args.length) {
      this.tmpError = "%!(BAD INDEX)";
      err = true;
    }
    this.argNum = err ? this.argNum : positional - 1;
  }
  /** Handle less than */
  handleLessThan() {
    const arg = this.args[this.argNum];
    if ((arg || {}).constructor.name !== "Array")
      throw new Error(`Cannot handle less than '<' flag: 'arg' is not an array`);
    let str = "[ ";
    for (let i = 0; i !== arg.length; ++i) {
      if (i !== 0) str += ", ";
      str += this._handleVerb(arg[i]);
    }
    return str + " ]";
  }
  /** Handle verb */
  handleVerb() {
    const verb = this.format[this.i];
    this.verb = verb || this.verb;
    if (this.tmpError) {
      this.buf += this.tmpError;
      this.tmpError = void 0;
      if (this.argNum < this.haveSeen.length) this.haveSeen[this.argNum] = true;
    } else if (this.args.length <= this.argNum) this.buf += `%!(MISSING '${verb}')`;
    else {
      const arg = this.args[this.argNum];
      this.haveSeen[this.argNum] = true;
      if (this.flags.lessthan) this.buf += this.handleLessThan();
      else this.buf += this._handleVerb(arg);
    }
    this.argNum++;
    this.state = State.PASSTHROUGH;
  }
  _handleVerb(arg) {
    switch (this.verb) {
      case "t":
        return this.pad(arg.toString());
      case "b":
        return this.fmtNumber(arg, 2);
      case "c":
        return this.fmtNumberCodePoint(arg);
      case "d":
        return this.fmtNumber(arg, 10);
      case "o":
        return this.fmtNumber(arg, 8);
      case "x":
        return this.fmtHex(arg);
      case "X":
        return this.fmtHex(arg, true);
      case "e":
        return this.fmtFloatE(arg);
      case "E":
        return this.fmtFloatE(arg, true);
      case "f":
      case "F":
        return this.fmtFloatF(arg);
      case "g":
        return this.fmtFloatG(arg);
      case "G":
        return this.fmtFloatG(arg, true);
      case "s":
        return this.fmtString(arg);
      case "T":
        return this.fmtString(typeof arg);
      case "v":
        return this.fmtV(arg);
      case "j":
        return this.fmtJ(arg);
      case "i":
        return this.fmtI(arg, false);
      case "I":
        return this.fmtI(arg, true);
      default:
        return `%!(BAD VERB '${this.verb}')`;
    }
  }
  /**
   * Pad a string
   * @param s text to pad
   */
  pad(s) {
    const padding = this.flags.zero ? "0" : " ";
    if (this.flags.dash) return s.padEnd(this.flags.width, padding);
    return s.padStart(this.flags.width, padding);
  }
  /**
   * Pad a number
   * @param nStr
   * @param neg
   */
  padNum(nStr, neg) {
    let sign;
    if (neg) sign = "-";
    else if (this.flags.plus || this.flags.space) sign = this.flags.plus ? "+" : " ";
    else sign = "";
    const zero = this.flags.zero;
    if (!zero) nStr = sign + nStr;
    const pad = zero ? "0" : " ";
    const len = zero ? this.flags.width - sign.length : this.flags.width;
    if (this.flags.dash) nStr = nStr.padEnd(len, pad);
    else nStr = nStr.padStart(len, pad);
    if (zero) nStr = sign + nStr;
    return nStr;
  }
  /**
   * Format a number
   * @param n
   * @param radix
   * @param upcase
   */
  fmtNumber(n, radix, upcase = false) {
    let num = Math.abs(n).toString(radix);
    const prec = this.flags.precision;
    if (prec !== -1) {
      this.flags.zero = false;
      num = n === 0 && prec === 0 ? "" : num;
      while (num.length < prec) num = "0" + num;
    }
    let prefix = "";
    if (this.flags.sharp)
      switch (radix) {
        case 2:
          prefix += "0b";
          break;
        case 8:
          prefix += num.startsWith("0") ? "" : "0";
          break;
        case 16:
          prefix += "0x";
          break;
        default:
          throw new Error(`Cannot handle the radix ${radix}: only 2, 8, 16 are supported`);
      }
    num = num.length === 0 ? num : prefix + num;
    if (upcase) num = num.toUpperCase();
    return this.padNum(num, n < 0);
  }
  /**
   * Format number with code points
   * @param n
   */
  fmtNumberCodePoint(n) {
    let s = "";
    try {
      s = String.fromCodePoint(n);
    } catch {
      s = UNICODE_REPLACEMENT_CHARACTER;
    }
    return this.pad(s);
  }
  /**
   * Format special float
   * @param n
   */
  fmtFloatSpecial(n) {
    if (isNaN(n)) {
      this.flags.zero = false;
      return this.padNum("NaN", false);
    }
    if (n === Number.POSITIVE_INFINITY) {
      this.flags.zero = false;
      this.flags.plus = true;
      return this.padNum("Inf", false);
    }
    if (n === Number.NEGATIVE_INFINITY) {
      this.flags.zero = false;
      return this.padNum("Inf", true);
    }
    return "";
  }
  /**
   * Round fraction to precision
   * @param fractional
   * @param precision
   * @returns tuple of fractional and round
   */
  roundFractionToPrecision(fractional, precision) {
    let round = false;
    if (fractional.length > precision) {
      fractional = "1" + fractional;
      let tmp = parseInt(fractional.slice(0, precision + 2)) / 10;
      tmp = Math.round(tmp);
      fractional = Math.floor(tmp).toString();
      round = fractional[0] === "2";
      fractional = fractional.slice(1);
    } else while (fractional.length < precision) fractional += "0";
    return [fractional, round];
  }
  /**
   * Format float E
   * @param n
   * @param upcase
   */
  fmtFloatE(n, upcase = false) {
    const special = this.fmtFloatSpecial(n);
    if (special !== "") return special;
    const m = n.toExponential().match(FLOAT_REGEXP);
    if (!m)
      throw new Error(
        "Should be unreachable, please file a bug report against Deno at https://github.com/denoland/std/issues",
      );
    const precision = this.flags.precision !== -1 ? this.flags.precision : DEFAULT_PRECISION;
    const [fractional, rounding] = this.roundFractionToPrecision(m[F.fractional] ?? "", precision);
    let e = m[F.exponent];
    let esign = m[F.esign];
    let mantissa = parseInt(m[F.mantissa]);
    if (rounding) {
      mantissa += 1;
      if (10 <= mantissa) {
        mantissa = 1;
        const r = parseInt(esign + e) + 1;
        e = Math.abs(r).toString();
        esign = r < 0 ? "-" : "+";
      }
    }
    e = e.length === 1 ? "0" + e : e;
    const val = `${mantissa}.${fractional}${upcase ? "E" : "e"}${esign}${e}`;
    return this.padNum(val, n < 0);
  }
  /**
   * Format float F
   * @param n
   */
  fmtFloatF(n) {
    const special = this.fmtFloatSpecial(n);
    if (special !== "") return special;
    function expandNumber(n) {
      if (Number.isSafeInteger(n)) return n.toString() + ".";
      const t = n.toExponential().split("e");
      let m = t[0].replace(".", "");
      const e = parseInt(t[1]);
      if (e < 0) {
        let nStr = "0.";
        for (let i = 0; i !== Math.abs(e) - 1; ++i) nStr += "0";
        return (nStr += m);
      } else {
        const splIdx = e + 1;
        while (m.length < splIdx) m += "0";
        return m.slice(0, splIdx) + "." + m.slice(splIdx);
      }
    }
    let [dig, fractional] = expandNumber(Math.abs(n)).split(".");
    const precision = this.flags.precision !== -1 ? this.flags.precision : DEFAULT_PRECISION;
    let round = false;
    [fractional, round] = this.roundFractionToPrecision(fractional, precision);
    if (round) dig = (parseInt(dig) + 1).toString();
    return this.padNum(`${dig}.${fractional}`, n < 0);
  }
  /**
   * Format float G
   * @param n
   * @param upcase
   */
  fmtFloatG(n, upcase = false) {
    const special = this.fmtFloatSpecial(n);
    if (special !== "") return special;
    let P = this.flags.precision !== -1 ? this.flags.precision : DEFAULT_PRECISION;
    P = P === 0 ? 1 : P;
    const m = n.toExponential().match(FLOAT_REGEXP);
    if (!m)
      throw new Error(
        "Should be unreachable, please file a bug report against Deno at https://github.com/denoland/std/issues",
      );
    const X = parseInt(m[F.exponent]) * (m[F.esign] === "-" ? -1 : 1);
    let nStr = "";
    if (P > X && X >= -4) {
      this.flags.precision = P - (X + 1);
      nStr = this.fmtFloatF(n);
      if (!this.flags.sharp) nStr = nStr.replace(/\.?0*$/, "");
    } else {
      this.flags.precision = P - 1;
      nStr = this.fmtFloatE(n);
      if (!this.flags.sharp) nStr = nStr.replace(/\.?0*e/, upcase ? "E" : "e");
    }
    return nStr;
  }
  /**
   * Format string
   * @param s
   */
  fmtString(s) {
    if (this.flags.precision !== -1) s = s.slice(0, this.flags.precision);
    const sac = stripAnsiCode(s);
    if (sac.length !== s.length) this.flags.width += s.length - sac.length;
    return this.pad(s);
  }
  /**
   * Format hex
   * @param val
   * @param upper
   */
  fmtHex(val, upper = false) {
    switch (typeof val) {
      case "number":
        return this.fmtNumber(val, 16, upper);
      case "string": {
        const sharp = this.flags.sharp && val.length !== 0;
        let hex = sharp ? "0x" : "";
        const prec = this.flags.precision;
        const end = prec !== -1 ? min(prec, val.length) : val.length;
        for (let i = 0; i !== end; ++i) {
          if (i !== 0 && this.flags.space) hex += sharp ? " 0x" : " ";
          const c = (val.charCodeAt(i) & 255).toString(16);
          hex += c.length === 1 ? `0${c}` : c;
        }
        if (upper) hex = hex.toUpperCase();
        return this.pad(hex);
      }
      default:
        throw new Error(
          `Cannot format hex, only number and string are supported for hex formatting: ${typeof val} is given`,
        );
    }
  }
  /**
   * Format value
   * @param val
   */
  fmtV(val) {
    if (this.flags.sharp) {
      const options = this.flags.precision !== -1 ? { depth: this.flags.precision } : {};
      return this.pad(inspect(val, options));
    } else {
      const p = this.flags.precision;
      const text = String(val);
      return p === -1 ? text : text.slice(0, p);
    }
  }
  /**
   * Format JSON
   * @param val
   */
  fmtJ(val) {
    return JSON.stringify(val);
  }
  /**
   * Format inspect
   * @param val
   * @param compact Whether or not the output should be compact.
   */
  fmtI(val, compact) {
    return inspect(val, {
      colors: !noColorFlag,
      compact,
      depth: Infinity,
      iterableLimit: Infinity,
    });
  }
};
/**
 * Converts and formats a variable number of `args` as is specified by `format`.
 * `sprintf` returns the formatted string.
 *
 * See the module documentation for the available format strings.
 *
 * @example Usage
 * ```ts
 * import { sprintf } from "@neostd/fmt";
 * import { equal } from "node:assert/strict";
 *
 * equal(sprintf("%d", 9), "9");
 *
 * equal(sprintf("%o", 9), "11");
 *
 * equal(sprintf("%f", 4), "4.000000");
 *
 * equal(sprintf("%.3f", 0.9999), "1.000");
 * ```
 *
 * @param format The format string to use
 * @param args The arguments to format
 * @returns The formatted string
 */
function sprintf(format, ...args) {
  return new Printf(format, ...args).doPrintf();
}
/**
 * Converts and format a variable number of `args` as is specified by `format`.
 * `printf` writes the formatted string to standard output.
 *
 * See the module documentation for the available format strings.
 *
 * @example Usage
 * ```ts no-assert
 * import { printf } from "@neostd/fmt";
 *
 * printf("%d", 9); // Prints "9"
 *
 * printf("%o", 9); // Prints "11"
 *
 * printf("%f", 4); // Prints "4.000000"
 *
 * printf("%.3f", 0.9999); // Prints "1.000"
 * ```
 *
 * @param format The format string to use
 * @param args The arguments to format
 */
function printf(format, ...args) {
  const s = sprintf(format, ...args);
  stdout.writeSync(new TextEncoder().encode(s));
}
/**
 * Converts and format a variable number of `args` as is specified by `format`.
 * `printf` writes the formatted string to standard output as a new line.
 *
 * See the module documentation for the available format strings.
 *
 * @example Usage
 * ```ts no-assert
 * import { printf } from "@neostd/fmt";
 *
 * printf("%d", 9); // Prints "9"
 *
 * printf("%o", 9); // Prints "11"
 *
 * printf("%f", 4); // Prints "4.000000"
 *
 * printf("%.3f", 0.9999); // Prints "1.000"
 * ```
 *
 * @param format The format string to use
 * @param args The arguments to format
 */
function echof(format, ...args) {
  const s = sprintf(format, ...args);
  const encoder = new TextEncoder();
  stdout.writeSync(encoder.encode(s));
  stdout.writeSync(encoder.encode(EOL));
}
/**
 * Print a newline to standard output.
 *
 * @param args The arguments to concatenate and print
 * @returns void
 * @example
 * ```ts
 * import { printLn } from "@neostd/fmt";
 *
 * printLn("Hello", "World"); // Prints "Hello World"
 * ```
 */
function print(...args) {
  if (args.length === 0) return;
  if (args.length === 1) {
    stdout.writeSync(new TextEncoder().encode(args[0]));
    return;
  }
  let s = "";
  for (const arg of args) s += arg;
  stdout.writeSync(new TextEncoder().encode(s));
}
/**
 * Print a newline to standard output.
 * @param args The arguments to concatenate and print
 *
 * @example
 * ```ts
 * import { printLn } from "@neostd/fmt";
 *
 * printLn("Hello", "World"); // Prints "Hello World\n"
 * ```
 */
function echo(...args) {
  if (args.length === 0) {
    stdout.writeSync(new TextEncoder().encode(EOL));
    return;
  }
  if (args.length === 1) {
    stdout.writeSync(new TextEncoder().encode(args[0] + EOL));
    return;
  }
  const encoder = new TextEncoder();
  const space = encoder.encode(" ");
  for (let i = 0; i < args.length; i++) {
    if (i !== 0) stdout.writeSync(space);
    stdout.writeSync(encoder.encode(args[i]));
  }
  stdout.writeSync(encoder.encode(EOL));
}
/**
 * Format a string with a format string and arguments and return an
 * error with the formatted message.
 *
 * @param format The format string to use
 * @param args The arguments to format
 * @returns A new `Error` object with the formatted message.
 */
function errorf(format, ...args) {
  const s = sprintf(format, ...args);
  return new Error(s);
}
//#endregion
export { echo, echof, errorf, print, printf, setNoColor, sprintf };
