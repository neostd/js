import { chdir } from "./chdir.ts";
import { history } from "./history.ts";

/** Pushes a directory onto the directory stack and changes to it. */
export function pushd(directory: string): void {
  chdir(directory);
  history.push(directory);
}
