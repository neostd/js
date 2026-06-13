//#region src/common/strip-trailing-separators.ts
function stripTrailingSeparators(segment, isSep) {
  if (segment.length <= 1) return segment;
  let end = segment.length;
  for (let i = segment.length - 1; i > 0; i--)
    if (isSep(segment.charCodeAt(i))) end = i;
    else break;
  return segment.slice(0, end);
}
//#endregion
export { stripTrailingSeparators };
