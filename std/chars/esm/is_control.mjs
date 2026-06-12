import { latin1 } from "./tables/latin1.mjs";
//#region src/is_control.ts
/**
* Determines whether the given character is a control character.
* @param char The character to check.
* @returns `true` if the character is a control character; otherwise, `false`.'
*
* @example
* ```ts
* import { IsControl } from "@neostd/chars/is-control";
*
* console.log(isControl(0x10FFFF)); // Output: false
* console.log(isControl(0.32)); // Output: false
* console.log(isControl(10)); // Output: true
* ```
*/
function isControl(char) {
	if (!Number.isInteger(char) || char < 0 || char > 255) return false;
	return (latin1[char] & 1) !== 0;
}
/**
* Determines whether the given character is a control character.
*
* @description
* Skips the type check and error handling for a faster execution. It should
* used when the character is known to be a valid Unicode code point such as
* calling `codePointAt` on a string.
*
* @param char The character to check.
* @returns `true` if the character is a control character; otherwise, `false`.'
*
* @example
* ```ts
* import { IsControl } from "@neostd/chars/is-control";
*
* console.log(isControl(0x10FFFF)); // Output: false
* console.log(isControl(0.32)); // Output: false
* console.log(isControl(10)); // Output: true
* ```
*/
function isControlUnsafe(char) {
	return (latin1[char] & 1) !== 0;
}
/**
* Determines whether the character at the specified index in the given string is a control character.
* @param str The input string.
* @param index The index of the character to check.
* @returns `true` if the character at the specified index is a control character; otherwise, `false`.
*
* @example
* ```ts
* import { isControlAt } from "@neostd/chars/is-control";
*
* const str = "Hello, world!";
* const index = 4;
* const isControl = isControlAt(str, index);
* console.log(isControl); // Output: false
* ```
*/
function isControlAt(str, index) {
	return (latin1[str.codePointAt(index) ?? 0] & 1) !== 0;
}
//#endregion
export { isControl, isControlAt, isControlUnsafe };
