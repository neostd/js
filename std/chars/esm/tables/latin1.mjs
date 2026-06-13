//#region src/tables/latin1.ts
const pC = 1;
const pP = 2;
const pN = 4;
const pS = 8;
const pZ = 16;
const pLu = 32;
const pLl = 64;
const pp = 128;
const pg = 144;
const pLo = 96;
const pLmask = 96;
const latin1 = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  144, 130, 130, 130, 136, 130, 130, 130, 130, 130, 130, 136, 130, 130, 130, 130, 132, 132, 132,
  132, 132, 132, 132, 132, 132, 132, 130, 130, 136, 136, 136, 130, 130, 160, 160, 160, 160, 160,
  160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160,
  160, 160, 130, 130, 130, 136, 130, 136, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192,
  192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 130, 136, 130, 136, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  16, 130, 136, 136, 136, 136, 136, 130, 136, 136, 224, 130, 136, 0, 136, 136, 136, 136, 132, 132,
  136, 192, 130, 130, 136, 132, 224, 130, 132, 132, 132, 130, 160, 160, 160, 160, 160, 160, 160,
  160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 160, 136, 160, 160,
  160, 160, 160, 160, 160, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192,
  192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 136, 192, 192, 192, 192, 192, 192, 192, 192,
];
const LINEAR_MAX = 18;
function is16(v, char) {
  if (v.length <= LINEAR_MAX || char <= 255) {
    for (const range of v) {
      const [l, h, stride] = range;
      if (l <= char && char <= h) return stride === 1 || (char - l) % stride === 0;
    }
    return false;
  }
  let lo = 0,
    hi = v.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const [l, h, stride] = v[mid];
    if (l <= char && char <= h) return stride === 1 || (char - l) % stride === 0;
    if (char < l) hi = mid;
    else lo = mid + 1;
  }
  return false;
}
function is32(v, char) {
  if (v.length <= LINEAR_MAX) {
    for (const range of v) {
      const [l, h, stride] = range;
      if (l <= char && char <= h) return stride === 1 || (char - l) % stride === 0;
    }
    return false;
  }
  let lo = 0,
    hi = v.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const [l, h, stride] = v[mid];
    if (l <= char && char <= h) return stride === 1 || (char - l) % stride === 0;
    if (char < l) hi = mid;
    else lo = mid + 1;
  }
  return false;
}
//#endregion
export { is16, is32, latin1, pC, pLl, pLmask, pLo, pLu, pN, pP, pS, pZ, pg, pp };
