//#region src/inspect.d.ts
interface InspectOptions {
  colors?: boolean;
  compact?: boolean;
  depth?: number;
  breakLength?: number;
  escapeSequences?: boolean;
  iterableLimit?: number;
  showProxy?: boolean;
  sorted?: boolean;
  trailingComma?: boolean;
  getters?: boolean;
  showHidden?: boolean;
  strAbbreviateSize?: number;
}
declare function inspect(value: unknown, options?: InspectOptions): string;
//#endregion
export { InspectOptions, inspect };
