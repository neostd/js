//#region src/_lazy.d.ts
declare class Lazy<T> {
  #private;
  constructor(fn: () => T);
  get hasValue(): boolean;
  get value(): T;
}
//#endregion
export { Lazy };