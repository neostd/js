//#region src/utils.ts
/**
 * Converts a string to a Uint32Array of characters.
 * Each element represents a Unicode code point, properly handling
 * characters outside the BMP (like emoji) that use surrogate pairs.
 * @param s The string to convert.
 * @returns The Uint32Array of characters (code points)
 */
function toCharArray(s) {
  const len = s.length;
  const result = new Uint32Array(len);
  let j = 0;
  for (let i = 0; i < len; i++) {
    const code = s.charCodeAt(i);
    if (code >= 55296 && code <= 56319 && i + 1 < len) {
      const low = s.charCodeAt(i + 1);
      if (low >= 56320 && low <= 57343) {
        result[j++] = ((code - 55296) << 10) + (low - 56320) + 65536;
        i++;
        continue;
      }
    }
    result[j++] = code;
  }
  return j < len ? result.subarray(0, j) : result;
}
/**
 * Converts a CharBuffer to a string.
 * @param buffer The character buffer to convert.
 * @returns The string.
 */
function toString(buffer) {
  if (typeof buffer === "string") return buffer;
  if (buffer instanceof Uint32Array) return String.fromCodePoint(...buffer);
  if (buffer instanceof Uint16Array) {
    const codePoints = new Uint32Array(buffer.buffer);
    return String.fromCodePoint(...codePoints);
  }
  if (buffer instanceof Uint8Array) {
    const codePoints = new Uint32Array(buffer.buffer);
    return String.fromCodePoint(...codePoints);
  }
  const codePoints = new Uint32Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) codePoints[i] = buffer.at(i) ?? 0;
  return String.fromCodePoint(...codePoints);
}
/**
 * Converts a CharBuffer to a CharSliceLike interface.
 * @param buffer The character buffer to convert.
 * @returns The slice.
 */
function toCharSliceLike(buffer) {
  if (typeof buffer === "string") {
    const buf = toCharArray(buffer);
    return {
      at(i) {
        return buf.at(i);
      },
      length: buf.length,
    };
  }
  if (buffer instanceof Uint32Array) return buffer;
  if (buffer instanceof Uint16Array) return new Uint32Array(buffer.buffer);
  if (buffer instanceof Uint8Array) return new Uint32Array(buffer.buffer);
  return buffer;
}
//#endregion
export { toCharArray, toCharSliceLike, toString };
