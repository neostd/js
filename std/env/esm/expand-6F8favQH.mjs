//#region src/globals.ts
const globals = globalThis;
const BROWSER = globals.process === void 0 && globals.Deno === void 0;
const WINDOWS =
  globals.Deno?.build.os === "windows" ||
  globals.process?.platform === "win32" ||
  globals.navigator?.platform.toLowerCase().includes("win") === true;
function getRuntimeArgs() {
  if (globals.Deno) return globals.Deno.args;
  if (globals.process) return globals.process.argv.slice(2);
  return [];
}
function loadChildProcess() {
  return globals.process?.getBuiltinModule?.("node:child_process");
}
//#endregion
//#region src/expand.ts
/**
 * The `expand` module provides functionality for expanding variables in strings
 *
 * @module
 */
const CHAR_BACKWARD_SLASH = 92;
const CHAR_PERCENT = 37;
const CHAR_UNDERSCORE = 95;
const CHAR_DOLLAR = 36;
const CHAR_OPEN_BRACE = 123;
const CHAR_CLOSE_BRACE = 125;
const CHAR_OPEN_PAREN = 40;
const CHAR_CLOSE_PAREN = 41;
function isLetterOrDigit(char) {
  return (char >= 65 && char <= 90) || (char >= 97 && char <= 122) || (char >= 48 && char <= 57);
}
function isValidBashVariable(value) {
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    if (i === 0 && !((char >= 65 && char <= 90) || (char >= 97 && char <= 122))) return false;
    if (!isLetterOrDigit(char) && char !== CHAR_UNDERSCORE) return false;
  }
  return true;
}
function decodeOutput(value) {
  if (value === void 0) return "";
  if (typeof value === "string") return value;
  return new TextDecoder().decode(value);
}
function defaultShellArgs() {
  return WINDOWS ? ["powershell.exe", "-NoProfile", "-NonInteractive", "-Command"] : ["bash", "-c"];
}
function splitCommand(command) {
  const args = [];
  const token = [];
  let quote = "";
  let started = false;
  for (let i = 0; i < command.length; i++) {
    const char = command[i] ?? "";
    if (char === "\\") {
      const next = command[i + 1] ?? "";
      if (next === " " || next === "	" || next === "'" || next === '"' || next === "\\") {
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
    if (char === " " || char === "	") {
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
  if (quote.length > 0) throw new Error("Bad substitution, unterminated quoted command.");
  if (started) args.push(token.join(""));
  return args;
}
function commandArgs(command, options) {
  if (options.useShell) return [...(options.shellArgs ?? defaultShellArgs()), command];
  return splitCommand(command);
}
async function resolveProtocol(value, options) {
  if (options.protocolHandler && value.includes("://")) return await options.protocolHandler(value);
  return value;
}
async function pushResolved(output, value, options) {
  if (value === void 0) return;
  const resolved = await resolveProtocol(value, options);
  if (resolved.length > 0) output.push(resolved);
}
function runCommand(command, options) {
  if (command.length === 0) return "";
  const [exe = "", ...args] = commandArgs(command, options);
  if (exe.length === 0) return "";
  if (
    globals.Bun &&
    globals.process &&
    exe === globals.process.execPath &&
    args.length === 1 &&
    (args[0] === "--version" || args[0] === "-v")
  )
    return globals.process.version;
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
    if (child.error) throw child.error;
    if (child.exitCode !== void 0 && child.exitCode !== 0) {
      const stderr = decodeOutput(child.stderr).trim();
      throw new Error(stderr || `Command substitution failed with exit code ${child.exitCode}.`);
    }
    return decodeOutput(child.stdout);
  }
  const childProcess = loadChildProcess();
  if (!childProcess) return "";
  const child = childProcess.spawnSync(exe, args, { stdio: "pipe" });
  if (child.error) throw child.error;
  return decodeOutput(child.stdout);
}
/**
 * Expands variables in a string using bash or windows style expansion.
 * @param template The template to expand.
 * @param options The substitution options for the expansion.
 * @returns The string with the expanded variables.
 */
function expand(template, options) {
  if (typeof template !== "string" || template.length === 0) return "";
  const settings = options ?? {};
  settings.variableExpansion ??= true;
  settings.customErrorMessage ??= true;
  settings.variableAssignment ??= true;
  settings.argsExpansion ??= true;
  const getValue = settings.get ?? (() => void 0);
  const setValue = settings.set ?? (() => void 0);
  const token = [];
  const output = [];
  let kind = 0;
  let remaining = template.length;
  for (let i = 0; i < template.length; i++) {
    remaining--;
    const char = template.charCodeAt(i);
    if (kind === 0) {
      if (settings.windowsExpansion && char === CHAR_PERCENT) {
        kind = 1;
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
            kind = 4;
            i++;
            remaining--;
            continue;
          }
          if (next === CHAR_OPEN_BRACE && remaining > 3) {
            kind = 3;
            i++;
            remaining--;
            continue;
          }
          if (remaining > 0 && isLetterOrDigit(next)) {
            kind = 2;
            continue;
          }
        }
      }
      output.push(String.fromCharCode(char));
      continue;
    }
    if (kind === 1 && char === CHAR_PERCENT) {
      if (token.length === 0) {
        output.push("%%");
        continue;
      }
      const value = getValue(String.fromCharCode(...token));
      if (value !== void 0 && value.length > 0) output.push(value);
      token.length = 0;
      kind = 0;
      continue;
    }
    if (kind === 4 && char === CHAR_CLOSE_PAREN) {
      if (token.length === 0) throw new Error("Bad substitution, missing command.");
      const command = String.fromCharCode(...token);
      token.length = 0;
      const commandOutput = runCommand(command, settings).trim();
      if (commandOutput.length > 0) output.push(commandOutput);
      kind = 0;
      continue;
    }
    if (kind === 3 && char === CHAR_CLOSE_BRACE) {
      if (token.length === 0)
        throw new Error("${} is a bad substitution. Variable name not provided.");
      const substitution = String.fromCharCode(...token);
      token.length = 0;
      let key = substitution;
      let defaultValue = "";
      let message;
      if (substitution.includes(":-")) {
        const parts = substitution.split(":-");
        key = parts[0] ?? "";
        defaultValue = parts[1] ?? "";
      } else if (substitution.includes(":=")) {
        const parts = substitution.split(":=");
        key = parts[0] ?? "";
        defaultValue = parts[1] ?? "";
        if (settings.variableAssignment && getValue(key) === void 0) setValue(key, defaultValue);
      } else if (substitution.includes(":?")) {
        const parts = substitution.split(":?");
        key = parts[0] ?? "";
        if (settings.customErrorMessage) message = parts[1] ?? "";
      } else if (substitution.includes(":")) {
        const parts = substitution.split(":");
        key = parts[0] ?? "";
        defaultValue = parts[1] ?? "";
      }
      if (key.length === 0) throw new Error("Bad substitution, empty variable name.");
      if (!isValidBashVariable(key))
        throw new Error(`Bad substitution, invalid variable name ${key}.`);
      const value = getValue(key);
      if (value !== void 0) output.push(value);
      else if (message !== void 0) throw new Error(message);
      else if (defaultValue.length > 0) output.push(defaultValue);
      else throw new Error(`Bad substitution, variable ${key} is not set.`);
      kind = 0;
      continue;
    }
    if (kind === 2 && (!(isLetterOrDigit(char) || char === CHAR_UNDERSCORE) || remaining === 0)) {
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
      if (key.length === 0) throw new Error("Bad substitution, empty variable name.");
      const index = Number.parseInt(key, 10);
      if (settings.argsExpansion && !Number.isNaN(index)) {
        const args = getRuntimeArgs();
        if (index >= 0 && index < args.length) output.push(args[index] ?? "");
        if (append) output.push(String.fromCharCode(char));
        kind = 0;
        continue;
      }
      if (!isValidBashVariable(key))
        throw new Error(`Bad substitution, invalid variable name ${key}.`);
      const value = getValue(key);
      if (value !== void 0 && value.length > 0) output.push(value);
      if (value === void 0) throw new Error(`Bad substitution, variable ${key} is not set.`);
      if (append) output.push(String.fromCharCode(char));
      kind = 0;
      continue;
    }
    token.push(char);
    if (remaining === 0) {
      if (kind === 1) throw new Error("Bad substitution, missing closing token '%'.");
      if (kind === 3) throw new Error("Bad substitution, missing closing token '}'.");
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
async function expandAsync(template, options) {
  if (typeof template !== "string" || template.length === 0) return "";
  const settings = options ?? {};
  settings.variableExpansion ??= true;
  settings.customErrorMessage ??= true;
  settings.variableAssignment ??= true;
  settings.argsExpansion ??= true;
  const getValue = settings.get ?? (() => void 0);
  const setValue = settings.set ?? (() => void 0);
  const token = [];
  const output = [];
  let kind = 0;
  let remaining = template.length;
  for (let i = 0; i < template.length; i++) {
    remaining--;
    const char = template.charCodeAt(i);
    if (kind === 0) {
      if (settings.windowsExpansion && char === CHAR_PERCENT) {
        kind = 1;
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
            kind = 4;
            i++;
            remaining--;
            continue;
          }
          if (next === CHAR_OPEN_BRACE && remaining > 3) {
            kind = 3;
            i++;
            remaining--;
            continue;
          }
          if (remaining > 0 && isLetterOrDigit(next)) {
            kind = 2;
            continue;
          }
        }
      }
      output.push(String.fromCharCode(char));
      continue;
    }
    if (kind === 1 && char === CHAR_PERCENT) {
      if (token.length === 0) {
        output.push("%%");
        continue;
      }
      const key = String.fromCharCode(...token);
      token.length = 0;
      kind = 0;
      await pushResolved(output, getValue(key), settings);
      continue;
    }
    if (kind === 4 && char === CHAR_CLOSE_PAREN) {
      if (token.length === 0) throw new Error("Bad substitution, missing command.");
      const command = String.fromCharCode(...token);
      token.length = 0;
      const commandOutput = await resolveProtocol(runCommand(command, settings).trim(), settings);
      if (commandOutput.length > 0) output.push(commandOutput);
      kind = 0;
      continue;
    }
    if (kind === 3 && char === CHAR_CLOSE_BRACE) {
      if (token.length === 0)
        throw new Error("${} is a bad substitution. Variable name not provided.");
      const substitution = String.fromCharCode(...token);
      token.length = 0;
      let key = substitution;
      let defaultValue = "";
      let message;
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
        if (settings.customErrorMessage) message = parts[1] ?? "";
      } else if (substitution.includes(":")) {
        const parts = substitution.split(":");
        key = parts[0] ?? "";
        defaultValue = parts[1] ?? "";
      }
      if (key.length === 0) throw new Error("Bad substitution, empty variable name.");
      if (!isValidBashVariable(key))
        throw new Error(`Bad substitution, invalid variable name ${key}.`);
      const value = getValue(key);
      if (value !== void 0) await pushResolved(output, value, settings);
      else if (message !== void 0) throw new Error(message);
      else if (defaultValue.length > 0)
        if (settings.variableAssignment && substitution.includes(":=")) {
          const resolvedDefault = await resolveProtocol(defaultValue, settings);
          setValue(key, resolvedDefault);
          if (resolvedDefault.length > 0) output.push(resolvedDefault);
        } else await pushResolved(output, defaultValue, settings);
      else throw new Error(`Bad substitution, variable ${key} is not set.`);
      kind = 0;
      continue;
    }
    if (kind === 2 && (!(isLetterOrDigit(char) || char === CHAR_UNDERSCORE) || remaining === 0)) {
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
      if (key.length === 0) throw new Error("Bad substitution, empty variable name.");
      const index = Number.parseInt(key, 10);
      if (settings.argsExpansion && !Number.isNaN(index)) {
        const args = getRuntimeArgs();
        if (index >= 0 && index < args.length)
          await pushResolved(output, args[index] ?? "", settings);
        if (append) output.push(String.fromCharCode(char));
        kind = 0;
        continue;
      }
      if (!isValidBashVariable(key))
        throw new Error(`Bad substitution, invalid variable name ${key}.`);
      const value = getValue(key);
      if (value !== void 0 && value.length > 0) await pushResolved(output, value, settings);
      if (value === void 0) throw new Error(`Bad substitution, variable ${key} is not set.`);
      if (append) output.push(String.fromCharCode(char));
      kind = 0;
      continue;
    }
    token.push(char);
    if (remaining === 0) {
      if (kind === 1) throw new Error("Bad substitution, missing closing token '%'.");
      if (kind === 3) throw new Error("Bad substitution, missing closing token '}'.");
    }
  }
  return output.join("");
}
//#endregion
export { globals as a, WINDOWS as i, expandAsync as n, BROWSER as r, expand as t };
