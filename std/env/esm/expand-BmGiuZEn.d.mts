//#region src/expand.d.ts
/**
 * Options for variable substitution.
 */
interface SubstitutionOptions {
  /**
   * Enables or disables Windows-style variable expansion.
   * @default true
   */
  windowsExpansion?: boolean;
  /**
   * Enables or disables bash-style variable expansion.
   * @default true
   */
  variableExpansion?: boolean;
  /**
   * Enables or disables Unix-style variable assignment.
   * @default true
   */
  variableAssignment?: boolean;
  /**
   * Enables or disables Unix-style custom error messages.
   * @default true
   */
  customErrorMessage?: boolean;
  /**
   * Enables or disables bash-style argument expansion.
   * @default true
   */
  argsExpansion?: boolean;
  /**
   * Enables bash-style command substitution.
   */
  commandSubstitution?: boolean;
  /**
   * Runs command substitutions through a shell instead of executing the command directly.
   * @default false
   */
  useShell?: boolean;
  /**
   * Shell executable and arguments used when `useShell` is enabled. The command is appended to this array.
   * @default ["powershell.exe", "-NoProfile", "-NonInteractive", "-Command"] on Windows, ["bash", "-c"] elsewhere
   */
  shellArgs?: string[];
  /**
   * A function that retrieves the value of an environment variable.
   * Setting this option overrides the default behavior
   * @param key - The name of the environment variable.
   * @returns The value of the environment variable, or `undefined` if it is not set.
   */
  get?: (key: string) => string | undefined;
  /**
   * A function that sets the value of an environment variable.
   * Setting this option overrides the default behavior.
   * @param key - The name of the environment variable.
   * @param value - The value to set.
   */
  set?: (key: string, value: string) => void;
}
/**
 * Resolves URL-like values during async expansion.
 */
type ProtocolHandler = (url: string) => string | Promise<string>;
/**
 * Options for async variable substitution.
 */
interface AsyncSubstitutionOptions extends SubstitutionOptions {
  /**
   * Resolves values that look like URLs (`scheme://...`) before they are emitted.
   *
   * This is useful for fetching secrets or config from a URI scheme such as
   * `keepass:///db.kdbx?key=path/to/key` without shelling out.
   */
  protocolHandler?: ProtocolHandler;
}
/**
 * Expands variables in a string using bash or windows style expansion.
 * @param template The template to expand.
 * @param options The substitution options for the expansion.
 * @returns The string with the expanded variables.
 */
declare function expand(template: string, options?: SubstitutionOptions): string;
/**
 * Expands variables asynchronously and can resolve URL-like values via a protocol handler.
 *
 * Use this when expansion needs to consult a secret store, API, or fetch-based resolver
 * for values such as `keepass:///db.kdbx?key=path/to/key`.
 */
declare function expandAsync(template: string, options?: AsyncSubstitutionOptions): Promise<string>;
//#endregion
export {
  expandAsync as a,
  expand as i,
  ProtocolHandler as n,
  SubstitutionOptions as r,
  AsyncSubstitutionOptions as t,
};
