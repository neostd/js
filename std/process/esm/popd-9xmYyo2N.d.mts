//#region src/popd.d.ts
/**
 * Pops the last directory from the directory stack and changes to it.
 *
 * @returns The popped directory, or `undefined` if the stack is empty.
 */
declare function popd(): string | undefined;
//#endregion
export { popd as t };
