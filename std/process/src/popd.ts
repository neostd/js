import { chdir } from "./chdir.ts";
import { history } from "./history.ts";

/**
 * Pops the last directory from the directory stack and changes to it.
 *
 * @returns The popped directory, or `undefined` if the stack is empty.
 */
export function popd(): string | undefined {
  const directory = history.pop();
  if (directory) {
    chdir(directory);
    return directory;
  }

  return undefined;
}
