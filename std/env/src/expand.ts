/**
 * The `expand` module provides functionality for expanding variables in strings
 *
 * @module
 */
import { getRuntimeArgs, globals, loadChildProcess, WINDOWS } from "./globals.ts";

const CHAR_BACKWARD_SLASH = 92;
const CHAR_PERCENT = 37;
const CHAR_UNDERSCORE = 95;
const CHAR_DOLLAR = 36;
const CHAR_OPEN_BRACE = 123;
const CHAR_CLOSE_BRACE = 125;
const CHAR_OPEN_PAREN = 40;
const CHAR_CLOSE_PAREN = 41;

/**
 * Options for variable substitution.
 */
export interface SubstitutionOptions {
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
export type ProtocolHandler = (url: string) => string | Promise<string>;

/**
 * Options for async variable substitution.
 */
export interface AsyncSubstitutionOptions extends SubstitutionOptions {
  /**
   * Resolves values that look like URLs (`scheme://...`) before they are emitted.
   *
   * This is useful for fetching secrets or config from a URI scheme such as
   * `keepass:///db.kdbx?key=path/to/key` without shelling out.
   */
  protocolHandler?: ProtocolHandler;
}

const enum TokenKind {
  None,
  Windows,
  BashVariable,
  BashInterpolation,
  CommandSubstitution,
}

function isLetterOrDigit(char: number): boolean {
  return (char >= 65 && char <= 90) || (char >= 97 && char <= 122) || (char >= 48 && char <= 57);
}

function isValidBashVariable(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);

    if (i === 0 && !((char >= 65 && char <= 90) || (char >= 97 && char <= 122))) {
      return false;
    }

    if (!isLetterOrDigit(char) && char !== CHAR_UNDERSCORE) {
      return false;
    }
  }

  return true;
}

function decodeOutput(value: Uint8Array | string | undefined): string {
  if (value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return new TextDecoder().decode(value);
}

function defaultShellArgs(): string[] {
  return WINDOWS ? ["powershell.exe", "-NoProfile", "-NonInteractive", "-Command"] : ["bash", "-c"];
}

function splitCommand(command: string): string[] {
  const args: string[] = [];
  const token: string[] = [];
  let quote = "";
  let started = false;

  for (let i = 0; i < command.length; i++) {
    const char = command[i] ?? "";

    if (char === "\\") {
      const next = command[i + 1] ?? "";
      if (next === " " || next === "\t" || next === "'" || next === '"' || next === "\\") {
        token.push(next);
        started = true;
        i++;
        continue;
      }

      token.push(char);
      started = true;
      continue;
    }

    if (quote.length > 0) {
      if (char === quote) {
        quote = "";
        continue;
      }

      token.push(char);
      continue;
    }

    if (char === "'" || char === '"') {
      quote = char;
      started = true;
      continue;
    }

    if (char === " " || char === "\t") {
      if (started) {
        args.push(token.join(""));
        token.length = 0;
        started = false;
      }
      continue;
    }

    token.push(char);
    started = true;
  }

  if (quote.length > 0) {
    throw new Error("Bad substitution, unterminated quoted command.");
  }

  if (started) {
    args.push(token.join(""));
  }

  return args;
}

function commandArgs(command: string, options: SubstitutionOptions): string[] {
  if (options.useShell) {
    return [...(options.shellArgs ?? defaultShellArgs()), command];
  }

  return splitCommand(command);
}

async function resolveProtocol(value: string, options: AsyncSubstitutionOptions): Promise<string> {
  if (options.protocolHandler && value.includes("://")) {
    return await options.protocolHandler(value);
  }

  return value;
}

async function pushResolved(
  output: string[],
  value: string | undefined,
  options: AsyncSubstitutionOptions,
): Promise<void> {
  if (value === undefined) {
    return;
  }

  const resolved = await resolveProtocol(value, options);
  if (resolved.length > 0) {
    output.push(resolved);
  }
}

function runCommand(command: string, options: SubstitutionOptions): string {
  if (command.length === 0) {
    return "";
  }

  const [exe = "", ...args] = commandArgs(command, options);

  if (exe.length === 0) {
    return "";
  }

  if (
    globals.Bun &&
    globals.process &&
    exe === globals.process.execPath &&
    args.length === 1 &&
    (args[0] === "--version" || args[0] === "-v")
  ) {
    return globals.process.version;
  }

  if (globals.Deno) {
    const child = new globals.Deno.Command(exe, {
      args,
      stderr: "piped",
      stdout: "piped",
    }).outputSync();

    if (child.code !== 0) {
      const stderr = decodeOutput(child.stderr).trim();
      throw new Error(stderr || `Command substitution failed with exit code ${child.code}.`);
    }

    return decodeOutput(child.stdout);
  }

  if (globals.Bun?.spawnSync) {
    const child = globals.Bun.spawnSync([exe, ...args], {
      stderr: "pipe",
      stdout: "pipe",
    });

    if (child.error) {
      throw child.error;
    }

    if (child.exitCode !== undefined && child.exitCode !== 0) {
      const stderr = decodeOutput(child.stderr).trim();
      throw new Error(stderr || `Command substitution failed with exit code ${child.exitCode}.`);
    }

    return decodeOutput(child.stdout);
  }

  const childProcess = loadChildProcess();
  if (!childProcess) {
    return "";
  }

  const child = childProcess.spawnSync(exe, args, {
    stdio: "pipe",
  });

  if (child.error) {
    throw child.error;
  }

  return decodeOutput(child.stdout);
}

/**
 * Expands variables in a string using bash or windows style expansion.
 * @param template The template to expand.
 * @param options The substitution options for the expansion.
 * @returns The string with the expanded variables.
 */
export function expand(template: string, options?: SubstitutionOptions): string {
  if (typeof template !== "string" || template.length === 0) {
    return "";
  }

  const settings = options ?? {};
  settings.variableExpansion ??= true;
  settings.customErrorMessage ??= true;
  settings.variableAssignment ??= true;
  settings.argsExpansion ??= true;

  const getValue = settings.get ?? (() => undefined);
  const setValue = settings.set ?? (() => undefined);
  const token: number[] = [];
  const output: string[] = [];
  let kind = TokenKind.None;
  let remaining = template.length;

  for (let i = 0; i < template.length; i++) {
    remaining--;
    const char = template.charCodeAt(i);

    if (kind === TokenKind.None) {
      if (settings.windowsExpansion && char === CHAR_PERCENT) {
        kind = TokenKind.Windows;
        continue;
      }

      if (settings.variableExpansion) {
        const next = i + 1 < template.length ? template.charCodeAt(i + 1) : 0;

        if (char === CHAR_BACKWARD_SLASH && next === CHAR_DOLLAR) {
          output.push("$");
          i++;
          continue;
        }

        if (char === CHAR_DOLLAR) {
          if (settings.commandSubstitution && next === CHAR_OPEN_PAREN && remaining > 2) {
            kind = TokenKind.CommandSubstitution;
            i++;
            remaining--;
            continue;
          }

          if (next === CHAR_OPEN_BRACE && remaining > 3) {
            kind = TokenKind.BashInterpolation;
            i++;
            remaining--;
            continue;
          }

          if (remaining > 0 && isLetterOrDigit(next)) {
            kind = TokenKind.BashVariable;
            continue;
          }
        }
      }

      output.push(String.fromCharCode(char));
      continue;
    }

    if (kind === TokenKind.Windows && char === CHAR_PERCENT) {
      if (token.length === 0) {
        output.push("%%");
        continue;
      }

      const key = String.fromCharCode(...token);
      const value = getValue(key);
      if (value !== undefined && value.length > 0) {
        output.push(value);
      }
      token.length = 0;
      kind = TokenKind.None;
      continue;
    }

    if (kind === TokenKind.CommandSubstitution && char === CHAR_CLOSE_PAREN) {
      if (token.length === 0) {
        throw new Error("Bad substitution, missing command.");
      }

      const command = String.fromCharCode(...token);
      token.length = 0;
      const commandOutput = runCommand(command, settings).trim();
      if (commandOutput.length > 0) {
        output.push(commandOutput);
      }
      kind = TokenKind.None;
      continue;
    }

    if (kind === TokenKind.BashInterpolation && char === CHAR_CLOSE_BRACE) {
      if (token.length === 0) {
        throw new Error("${} is a bad substitution. Variable name not provided.");
      }

      const substitution = String.fromCharCode(...token);
      token.length = 0;
      let key = substitution;
      let defaultValue = "";
      let message: string | undefined;

      if (substitution.includes(":-")) {
        const parts = substitution.split(":-");
        key = parts[0] ?? "";
        defaultValue = parts[1] ?? "";
      } else if (substitution.includes(":=")) {
        const parts = substitution.split(":=");
        key = parts[0] ?? "";
        defaultValue = parts[1] ?? "";

        if (settings.variableAssignment && getValue(key) === undefined) {
          setValue(key, defaultValue);
        }
      } else if (substitution.includes(":?")) {
        const parts = substitution.split(":?");
        key = parts[0] ?? "";
        if (settings.customErrorMessage) {
          message = parts[1] ?? "";
        }
      } else if (substitution.includes(":")) {
        const parts = substitution.split(":");
        key = parts[0] ?? "";
        defaultValue = parts[1] ?? "";
      }

      if (key.length === 0) {
        throw new Error("Bad substitution, empty variable name.");
      }

      if (!isValidBashVariable(key)) {
        throw new Error(`Bad substitution, invalid variable name ${key}.`);
      }

      const value = getValue(key);
      if (value !== undefined) {
        output.push(value);
      } else if (message !== undefined) {
        throw new Error(message);
      } else if (defaultValue.length > 0) {
        output.push(defaultValue);
      } else {
        throw new Error(`Bad substitution, variable ${key} is not set.`);
      }

      kind = TokenKind.None;
      continue;
    }

    if (
      kind === TokenKind.BashVariable &&
      (!(isLetterOrDigit(char) || char === CHAR_UNDERSCORE) || remaining === 0)
    ) {
      let append = char !== CHAR_BACKWARD_SLASH;

      if (remaining === 0 && isLetterOrDigit(char)) {
        append = false;
        token.push(char);
      }

      if (char === CHAR_DOLLAR) {
        append = false;
        i--;
      }

      const key = String.fromCharCode(...token);
      token.length = 0;
      if (key.length === 0) {
        throw new Error("Bad substitution, empty variable name.");
      }

      const index = Number.parseInt(key, 10);
      if (settings.argsExpansion && !Number.isNaN(index)) {
        const args = getRuntimeArgs();
        if (index >= 0 && index < args.length) {
          output.push(args[index] ?? "");
        }

        if (append) {
          output.push(String.fromCharCode(char));
        }

        kind = TokenKind.None;
        continue;
      }

      if (!isValidBashVariable(key)) {
        throw new Error(`Bad substitution, invalid variable name ${key}.`);
      }

      const value = getValue(key);
      if (value !== undefined && value.length > 0) {
        output.push(value);
      }

      if (value === undefined) {
        throw new Error(`Bad substitution, variable ${key} is not set.`);
      }

      if (append) {
        output.push(String.fromCharCode(char));
      }

      kind = TokenKind.None;
      continue;
    }

    token.push(char);
    if (remaining === 0) {
      if (kind === TokenKind.Windows) {
        throw new Error("Bad substitution, missing closing token '%'.");
      }

      if (kind === TokenKind.BashInterpolation) {
        throw new Error("Bad substitution, missing closing token '}'.");
      }
    }
  }

  return output.join("");
}

/**
 * Expands variables asynchronously and can resolve URL-like values via a protocol handler.
 *
 * Use this when expansion needs to consult a secret store, API, or fetch-based resolver
 * for values such as `keepass:///db.kdbx?key=path/to/key`.
 */
export async function expandAsync(
  template: string,
  options?: AsyncSubstitutionOptions,
): Promise<string> {
  if (typeof template !== "string" || template.length === 0) {
    return "";
  }

  const settings = options ?? {};
  settings.variableExpansion ??= true;
  settings.customErrorMessage ??= true;
  settings.variableAssignment ??= true;
  settings.argsExpansion ??= true;

  const getValue = settings.get ?? (() => undefined);
  const setValue = settings.set ?? (() => undefined);
  const token: number[] = [];
  const output: string[] = [];
  let kind = TokenKind.None;
  let remaining = template.length;

  for (let i = 0; i < template.length; i++) {
    remaining--;
    const char = template.charCodeAt(i);

    if (kind === TokenKind.None) {
      if (settings.windowsExpansion && char === CHAR_PERCENT) {
        kind = TokenKind.Windows;
        continue;
      }

      if (settings.variableExpansion) {
        const next = i + 1 < template.length ? template.charCodeAt(i + 1) : 0;

        if (char === CHAR_BACKWARD_SLASH && next === CHAR_DOLLAR) {
          output.push("$");
          i++;
          continue;
        }

        if (char === CHAR_DOLLAR) {
          if (settings.commandSubstitution && next === CHAR_OPEN_PAREN && remaining > 2) {
            kind = TokenKind.CommandSubstitution;
            i++;
            remaining--;
            continue;
          }

          if (next === CHAR_OPEN_BRACE && remaining > 3) {
            kind = TokenKind.BashInterpolation;
            i++;
            remaining--;
            continue;
          }

          if (remaining > 0 && isLetterOrDigit(next)) {
            kind = TokenKind.BashVariable;
            continue;
          }
        }
      }

      output.push(String.fromCharCode(char));
      continue;
    }

    if (kind === TokenKind.Windows && char === CHAR_PERCENT) {
      if (token.length === 0) {
        output.push("%%");
        continue;
      }

      const key = String.fromCharCode(...token);
      token.length = 0;
      kind = TokenKind.None;
      await pushResolved(output, getValue(key), settings);
      continue;
    }

    if (kind === TokenKind.CommandSubstitution && char === CHAR_CLOSE_PAREN) {
      if (token.length === 0) {
        throw new Error("Bad substitution, missing command.");
      }

      const command = String.fromCharCode(...token);
      token.length = 0;
      const commandOutput = await resolveProtocol(runCommand(command, settings).trim(), settings);
      if (commandOutput.length > 0) {
        output.push(commandOutput);
      }
      kind = TokenKind.None;
      continue;
    }

    if (kind === TokenKind.BashInterpolation && char === CHAR_CLOSE_BRACE) {
      if (token.length === 0) {
        throw new Error("${} is a bad substitution. Variable name not provided.");
      }

      const substitution = String.fromCharCode(...token);
      token.length = 0;
      let key = substitution;
      let defaultValue = "";
      let message: string | undefined;

      if (substitution.includes(":-")) {
        const parts = substitution.split(":-");
        key = parts[0] ?? "";
        defaultValue = parts[1] ?? "";
      } else if (substitution.includes(":=")) {
        const parts = substitution.split(":=");
        key = parts[0] ?? "";
        defaultValue = parts[1] ?? "";
      } else if (substitution.includes(":?")) {
        const parts = substitution.split(":?");
        key = parts[0] ?? "";
        if (settings.customErrorMessage) {
          message = parts[1] ?? "";
        }
      } else if (substitution.includes(":")) {
        const parts = substitution.split(":");
        key = parts[0] ?? "";
        defaultValue = parts[1] ?? "";
      }

      if (key.length === 0) {
        throw new Error("Bad substitution, empty variable name.");
      }

      if (!isValidBashVariable(key)) {
        throw new Error(`Bad substitution, invalid variable name ${key}.`);
      }

      const value = getValue(key);
      if (value !== undefined) {
        await pushResolved(output, value, settings);
      } else if (message !== undefined) {
        throw new Error(message);
      } else if (defaultValue.length > 0) {
        if (settings.variableAssignment && substitution.includes(":=")) {
          const resolvedDefault = await resolveProtocol(defaultValue, settings);
          setValue(key, resolvedDefault);
          if (resolvedDefault.length > 0) {
            output.push(resolvedDefault);
          }
        } else {
          await pushResolved(output, defaultValue, settings);
        }
      } else {
        throw new Error(`Bad substitution, variable ${key} is not set.`);
      }

      kind = TokenKind.None;
      continue;
    }

    if (
      kind === TokenKind.BashVariable &&
      (!(isLetterOrDigit(char) || char === CHAR_UNDERSCORE) || remaining === 0)
    ) {
      let append = char !== CHAR_BACKWARD_SLASH;

      if (remaining === 0 && isLetterOrDigit(char)) {
        append = false;
        token.push(char);
      }

      if (char === CHAR_DOLLAR) {
        append = false;
        i--;
      }

      const key = String.fromCharCode(...token);
      token.length = 0;
      if (key.length === 0) {
        throw new Error("Bad substitution, empty variable name.");
      }

      const index = Number.parseInt(key, 10);
      if (settings.argsExpansion && !Number.isNaN(index)) {
        const args = getRuntimeArgs();
        if (index >= 0 && index < args.length) {
          await pushResolved(output, args[index] ?? "", settings);
        }

        if (append) {
          output.push(String.fromCharCode(char));
        }

        kind = TokenKind.None;
        continue;
      }

      if (!isValidBashVariable(key)) {
        throw new Error(`Bad substitution, invalid variable name ${key}.`);
      }

      const value = getValue(key);
      if (value !== undefined && value.length > 0) {
        await pushResolved(output, value, settings);
      }

      if (value === undefined) {
        throw new Error(`Bad substitution, variable ${key} is not set.`);
      }

      if (append) {
        output.push(String.fromCharCode(char));
      }

      kind = TokenKind.None;
      continue;
    }

    token.push(char);
    if (remaining === 0) {
      if (kind === TokenKind.Windows) {
        throw new Error("Bad substitution, missing closing token '%'.");
      }

      if (kind === TokenKind.BashInterpolation) {
        throw new Error("Bad substitution, missing closing token '}'.");
      }
    }
  }

  return output.join("");
}
