//#region src/constants.ts
/**
* Uppercase A character code (65).
*
* @example
* ```ts
* import { CHAR_UPPERCASE_A } from "@neostd/chars";
*
* const char = "Apple".charCodeAt(0);
* console.log(char === CHAR_UPPERCASE_A); // true
* ```
*/
const CHAR_UPPERCASE_A = 65;
/**
* Lowercase A character code (97).
*
* @example
* ```ts
* import { CHAR_LOWERCASE_A } from "@neostd/chars";
*
* const char = "apple".charCodeAt(0);
* console.log(char === CHAR_LOWERCASE_A); // true
* ```
*/
const CHAR_LOWERCASE_A = 97;
/**
* Uppercase Z character code (90).
*
* @example
* ```ts
* import { CHAR_UPPERCASE_Z } from "@neostd/chars";
*
* const char = "Zebra".charCodeAt(0);
* console.log(char === CHAR_UPPERCASE_Z); // true
* ```
*/
const CHAR_UPPERCASE_Z = 90;
/**
* Lowercase Z character code (122).
*
* @example
* ```ts
* import { CHAR_LOWERCASE_Z } from "@neostd/chars";
*
* const char = "zebra".charCodeAt(0);
* console.log(char === CHAR_LOWERCASE_Z); // true
* ```
*/
const CHAR_LOWERCASE_Z = 122;
/**
* Dot `.` character code (46).
*
* @example
* ```ts
* import { CHAR_DOT } from "@neostd/chars";
*
* const char = "file.txt".charCodeAt(4);
* console.log(char === CHAR_DOT); // true
* ```
*/
const CHAR_DOT = 46;
/**
* Forward slash `/` character code (47).
*
* @example
* ```ts
* import { CHAR_FORWARD_SLASH } from "@neostd/chars";
*
* const char = "/home/user".charCodeAt(0);
* console.log(char === CHAR_FORWARD_SLASH); // true
* ```
*/
const CHAR_FORWARD_SLASH = 47;
/**
* Backward slash `\` character code (92).
*
* @example
* ```ts
* import { CHAR_BACKWARD_SLASH } from "@neostd/chars";
*
* const char = "C:\\Users".charCodeAt(2);
* console.log(char === CHAR_BACKWARD_SLASH); // true
* ```
*/
const CHAR_BACKWARD_SLASH = 92;
/**
* Vertical line `|` character code (124).
*
* @example
* ```ts
* import { CHAR_VERTICAL_LINE } from "@neostd/chars";
*
* const char = "a|b".charCodeAt(1);
* console.log(char === CHAR_VERTICAL_LINE); // true
* ```
*/
const CHAR_VERTICAL_LINE = 124;
/**
* Colon `:` character code (58).
*
* @example
* ```ts
* import { CHAR_COLON } from "@neostd/chars";
*
* const char = "key:value".charCodeAt(3);
* console.log(char === CHAR_COLON); // true
* ```
*/
const CHAR_COLON = 58;
/**
* Question mark `?` character code (63).
*
* @example
* ```ts
* import { CHAR_QUESTION_MARK } from "@neostd/chars";
*
* const char = "why?".charCodeAt(3);
* console.log(char === CHAR_QUESTION_MARK); // true
* ```
*/
const CHAR_QUESTION_MARK = 63;
/**
* Underscore `_` character code (95).
*
* @example
* ```ts
* import { CHAR_UNDERSCORE } from "@neostd/chars";
*
* const char = "my_var".charCodeAt(2);
* console.log(char === CHAR_UNDERSCORE); // true
* ```
*/
const CHAR_UNDERSCORE = 95;
/**
* Line feed `\n` character code (10).
*
* @example
* ```ts
* import { CHAR_LINE_FEED } from "@neostd/chars";
*
* const char = "line1\nline2".charCodeAt(5);
* console.log(char === CHAR_LINE_FEED); // true
* ```
*/
const CHAR_LINE_FEED = 10;
/**
* Carriage return `\r` character code (13).
*
* @example
* ```ts
* import { CHAR_CARRIAGE_RETURN } from "@neostd/chars";
*
* const char = "line1\r\n".charCodeAt(5);
* console.log(char === CHAR_CARRIAGE_RETURN); // true
* ```
*/
const CHAR_CARRIAGE_RETURN = 13;
/**
* Tab `\t` character code (9).
*
* @example
* ```ts
* import { CHAR_TAB } from "@neostd/chars";
*
* const char = "col1\tcol2".charCodeAt(4);
* console.log(char === CHAR_TAB); // true
* ```
*/
const CHAR_TAB = 9;
/**
* Form feed `\f` character code (12).
*
* @example
* ```ts
* import { CHAR_FORM_FEED } from "@neostd/chars";
*
* const char = "page1\fpage2".charCodeAt(5);
* console.log(char === CHAR_FORM_FEED); // true
* ```
*/
const CHAR_FORM_FEED = 12;
/**
* Exclamation mark `!` character code (33).
*
* @example
* ```ts
* import { CHAR_EXCLAMATION_MARK } from "@neostd/chars";
*
* const char = "Hello!".charCodeAt(5);
* console.log(char === CHAR_EXCLAMATION_MARK); // true
* ```
*/
const CHAR_EXCLAMATION_MARK = 33;
/**
* Hash `#` character code (35).
*
* @example
* ```ts
* import { CHAR_HASH } from "@neostd/chars";
*
* const char = "#hashtag".charCodeAt(0);
* console.log(char === CHAR_HASH); // true
* ```
*/
const CHAR_HASH = 35;
/**
* Space ` ` character code (32).
*
* @example
* ```ts
* import { CHAR_SPACE } from "@neostd/chars";
*
* const char = "hello world".charCodeAt(5);
* console.log(char === CHAR_SPACE); // true
* ```
*/
const CHAR_SPACE = 32;
/**
* Non-breaking space `\u00A0` character code (160).
*
* @example
* ```ts
* import { CHAR_NO_BREAK_SPACE } from "@neostd/chars";
*
* const char = "100\u00A0km".charCodeAt(3);
* console.log(char === CHAR_NO_BREAK_SPACE); // true
* ```
*/
const CHAR_NO_BREAK_SPACE = 160;
/**
* Zero-width space no-break `\uFEFF` character code (65279).
* Also known as the Byte Order Mark (BOM).
*
* @example
* ```ts
* import { CHAR_ZERO_WIDTH_NOBREAK_SPACE } from "@neostd/chars";
*
* const char = "\uFEFFHello".charCodeAt(0);
* console.log(char === CHAR_ZERO_WIDTH_NOBREAK_SPACE); // true
* ```
*/
const CHAR_ZERO_WIDTH_NOBREAK_SPACE = 65279;
/**
* Left square bracket `[` character code (91).
*
* @example
* ```ts
* import { CHAR_LEFT_SQUARE_BRACKET } from "@neostd/chars";
*
* const char = "[item]".charCodeAt(0);
* console.log(char === CHAR_LEFT_SQUARE_BRACKET); // true
* ```
*/
const CHAR_LEFT_SQUARE_BRACKET = 91;
/**
* Right square bracket `]` character code (93).
*
* @example
* ```ts
* import { CHAR_RIGHT_SQUARE_BRACKET } from "@neostd/chars";
*
* const char = "[item]".charCodeAt(5);
* console.log(char === CHAR_RIGHT_SQUARE_BRACKET); // true
* ```
*/
const CHAR_RIGHT_SQUARE_BRACKET = 93;
/**
* Left angle bracket `<` character code (60).
*
* @example
* ```ts
* import { CHAR_LEFT_ANGLE_BRACKET } from "@neostd/chars";
*
* const char = "<div>".charCodeAt(0);
* console.log(char === CHAR_LEFT_ANGLE_BRACKET); // true
* ```
*/
const CHAR_LEFT_ANGLE_BRACKET = 60;
/**
* Right angle bracket `>` character code (62).
*
* @example
* ```ts
* import { CHAR_RIGHT_ANGLE_BRACKET } from "@neostd/chars";
*
* const char = "<div>".charCodeAt(4);
* console.log(char === CHAR_RIGHT_ANGLE_BRACKET); // true
* ```
*/
const CHAR_RIGHT_ANGLE_BRACKET = 62;
/**
* Left curly bracket `{` character code (123).
*
* @example
* ```ts
* import { CHAR_LEFT_CURLY_BRACKET } from "@neostd/chars";
*
* const char = "{key: value}".charCodeAt(0);
* console.log(char === CHAR_LEFT_CURLY_BRACKET); // true
* ```
*/
const CHAR_LEFT_CURLY_BRACKET = 123;
/**
* Right curly bracket `}` character code (125).
*
* @example
* ```ts
* import { CHAR_RIGHT_CURLY_BRACKET } from "@neostd/chars";
*
* const char = "{}".charCodeAt(1);
* console.log(char === CHAR_RIGHT_CURLY_BRACKET); // true
* ```
*/
const CHAR_RIGHT_CURLY_BRACKET = 125;
/**
* Hyphen `-` character code (45).
*
* @example
* ```ts
* import { CHAR_HYPHEN_MINUS } from "@neostd/chars";
*
* const char = "a-b".charCodeAt(1);
* console.log(char === CHAR_HYPHEN_MINUS); // true
* ```
*/
const CHAR_HYPHEN_MINUS = 45;
/**
* Plus `+` character code (43).
*
* @example
* ```ts
* import { CHAR_PLUS } from "@neostd/chars";
*
* const char = "1+2".charCodeAt(1);
* console.log(char === CHAR_PLUS); // true
* ```
*/
const CHAR_PLUS = 43;
/**
* Double quote `"` character code (34).
*
* @example
* ```ts
* import { CHAR_DOUBLE_QUOTE } from "@neostd/chars";
*
* const char = '"hello"'.charCodeAt(0);
* console.log(char === CHAR_DOUBLE_QUOTE); // true
* ```
*/
const CHAR_DOUBLE_QUOTE = 34;
/**
* Single quote `'` character code (39).
*
* @example
* ```ts
* import { CHAR_SINGLE_QUOTE } from "@neostd/chars";
*
* const char = "'hello'".charCodeAt(0);
* console.log(char === CHAR_SINGLE_QUOTE); // true
* ```
*/
const CHAR_SINGLE_QUOTE = 39;
/**
* Percent `%` character code (37).
*
* @example
* ```ts
* import { CHAR_PERCENT } from "@neostd/chars";
*
* const char = "100%".charCodeAt(3);
* console.log(char === CHAR_PERCENT); // true
* ```
*/
const CHAR_PERCENT = 37;
/**
* Semicolon `;` character code (59).
*
* @example
* ```ts
* import { CHAR_SEMICOLON } from "@neostd/chars";
*
* const char = "a;b".charCodeAt(1);
* console.log(char === CHAR_SEMICOLON); // true
* ```
*/
const CHAR_SEMICOLON = 59;
/**
* Circumflex accent `^` character code (94).
*
* @example
* ```ts
* import { CHAR_CIRCUMFLEX_ACCENT } from "@neostd/chars";
*
* const char = "2^8".charCodeAt(1);
* console.log(char === CHAR_CIRCUMFLEX_ACCENT); // true
* ```
*/
const CHAR_CIRCUMFLEX_ACCENT = 94;
/**
* Grave accent `` ` `` character code (96).
*
* @example
* ```ts
* import { CHAR_GRAVE_ACCENT } from "@neostd/chars";
*
* const char = "`code`".charCodeAt(0);
* console.log(char === CHAR_GRAVE_ACCENT); // true
* ```
*/
const CHAR_GRAVE_ACCENT = 96;
/**
* At sign `@` character code (64).
*
* @example
* ```ts
* import { CHAR_AT } from "@neostd/chars";
*
* const char = "user@email.com".charCodeAt(4);
* console.log(char === CHAR_AT); // true
* ```
*/
const CHAR_AT = 64;
/**
* Ampersand `&` character code (38).
*
* @example
* ```ts
* import { CHAR_AMPERSAND } from "@neostd/chars";
*
* const char = "a&b".charCodeAt(1);
* console.log(char === CHAR_AMPERSAND); // true
* ```
*/
const CHAR_AMPERSAND = 38;
/**
* Tilde `~` character code (126).
*
* @example
* ```ts
* import { CHAR_TILDA } from "@neostd/chars";
*
* const char = "~/home".charCodeAt(0);
* console.log(char === CHAR_TILDA); // true
* ```
*/
const CHAR_TILDA = 126;
/**
* Dollar sign `$` character code (36).
*
* @example
* ```ts
* import { CHAR_DOLLAR } from "@neostd/chars";
*
* const char = "$100".charCodeAt(0);
* console.log(char === CHAR_DOLLAR); // true
* ```
*/
const CHAR_DOLLAR = 36;
/**
* Vertical tab `\v` character code (11).
*
* @example
* ```ts
* import { CHAR_VERTICAL_TAB } from "@neostd/chars";
*
* const char = "a\vb".charCodeAt(1);
* console.log(char === CHAR_VERTICAL_TAB); // true
* ```
*/
const CHAR_VERTICAL_TAB = 11;
/**
* Asterisk `*` character code (42).
*
* @example
* ```ts
* import { CHAR_ASTERISK } from "@neostd/chars";
*
* const char = "2*3".charCodeAt(1);
* console.log(char === CHAR_ASTERISK); // true
* ```
*/
const CHAR_ASTERISK = 42;
/**
* Comma `,` character code (44).
*
* @example
* ```ts
* import { CHAR_COMMA } from "@neostd/chars";
*
* const char = "a,b".charCodeAt(1);
* console.log(char === CHAR_COMMA); // true
* ```
*/
const CHAR_COMMA = 44;
/**
* Equal character (`=`) code (61).
*
* @example
* ```ts
* import { CHAR_EQUAL } from "@neostd/chars";
*
* const char = "a=b".charCodeAt(1);
* console.log(char === CHAR_EQUAL); // true
* ```
*/
const CHAR_EQUAL = 61;
/**
* Digit 0 character code (48).
*
* @example
* ```ts
* import { CHAR_0 } from "@neostd/chars";
*
* const char = "0123".charCodeAt(0);
* console.log(char === CHAR_0); // true
* ```
*/
const CHAR_0 = 48;
/**
* Digit 9 character code (57).
*
* @example
* ```ts
* import { CHAR_9 } from "@neostd/chars";
*
* const char = "789".charCodeAt(2);
* console.log(char === CHAR_9); // true
* ```
*/
const CHAR_9 = 57;
/**
* The max rune value (0x10FFFF).
* This is the maximum value for a Unicode code point.
* It is used to represent the maximum value of a rune in Go.
* In JavaScript, the maximum value for a number is 2^53 - 1.
* However, the maximum value for a Unicode code point is 0x10FFFF.
*
* @example
* ```ts
* import { MAX_RUNE, isChar } from "@neostd/chars";
*
* console.log(MAX_RUNE); // 1114111
* console.log(isChar(MAX_RUNE)); // true
* console.log(isChar(MAX_RUNE + 1)); // false
* ```
*/
const MAX_RUNE = 1114111;
//#endregion
export { CHAR_0, CHAR_9, CHAR_AMPERSAND, CHAR_ASTERISK, CHAR_AT, CHAR_BACKWARD_SLASH, CHAR_CARRIAGE_RETURN, CHAR_CIRCUMFLEX_ACCENT, CHAR_COLON, CHAR_COMMA, CHAR_DOLLAR, CHAR_DOT, CHAR_DOUBLE_QUOTE, CHAR_EQUAL, CHAR_EXCLAMATION_MARK, CHAR_FORM_FEED, CHAR_FORWARD_SLASH, CHAR_GRAVE_ACCENT, CHAR_HASH, CHAR_HYPHEN_MINUS, CHAR_LEFT_ANGLE_BRACKET, CHAR_LEFT_CURLY_BRACKET, CHAR_LEFT_SQUARE_BRACKET, CHAR_LINE_FEED, CHAR_LOWERCASE_A, CHAR_LOWERCASE_Z, CHAR_NO_BREAK_SPACE, CHAR_PERCENT, CHAR_PLUS, CHAR_QUESTION_MARK, CHAR_RIGHT_ANGLE_BRACKET, CHAR_RIGHT_CURLY_BRACKET, CHAR_RIGHT_SQUARE_BRACKET, CHAR_SEMICOLON, CHAR_SINGLE_QUOTE, CHAR_SPACE, CHAR_TAB, CHAR_TILDA, CHAR_UNDERSCORE, CHAR_UPPERCASE_A, CHAR_UPPERCASE_Z, CHAR_VERTICAL_LINE, CHAR_VERTICAL_TAB, CHAR_ZERO_WIDTH_NOBREAK_SPACE, MAX_RUNE };
