import { fail, ok } from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { bun, hasBun, node } from "./runtime.ts";

const writeStdout = fileURLToPath(new URL("./internal/write-stdout.ts", import.meta.url));
const writeStderr = fileURLToPath(new URL("./internal/write-stderr.ts", import.meta.url));
const readStdin = fileURLToPath(new URL("./internal/read-stdin.ts", import.meta.url));
const readStdinAsync = fileURLToPath(new URL("./internal/read-stdin-async.ts", import.meta.url));
const readStdinIterator = fileURLToPath(
  new URL("./internal/read-stdin-iterator.ts", import.meta.url),
);

function assertSpawnOutput(runtime: string, args: string[], stream: "stdout" | "stderr") {
  const result = spawnSync(runtime, args, { encoding: "utf8", stdio: "pipe" });
  if (result.status !== 0) {
    fail(`${runtime} run failed ${result.stdout} ${result.stderr}`);
  }

  const output = stream === "stdout" ? result.stdout : result.stderr;
  ok(output.includes("writeSync"));
  ok(output.includes("write"));
}

async function assertStdinEcho(runtime: string, helper: string) {
  const child = spawn(runtime, [helper], { stdio: ["pipe", "pipe", "pipe"] });
  const data: string[] = [];

  child.stdout.on("data", (chunk) => {
    data.push(String(chunk));
  });

  child.stdin.write("hello world");
  child.stdin.end();

  await new Promise((resolve) => {
    child.on("close", resolve);
  });

  const output = data.join("");
  if (child.exitCode !== 0) {
    fail(`${runtime} run failed ${output}`);
  }

  ok(output.includes("hello world"));
}

test("process::stdout in node child process", () => {
  assertSpawnOutput(node, [writeStdout], "stdout");
});

test("process::stdout in bun child process", { skip: !hasBun }, () => {
  assertSpawnOutput(bun, [writeStdout], "stdout");
});

test("process::stderr in node child process", () => {
  assertSpawnOutput(node, [writeStderr], "stderr");
});

test("process::stderr in bun child process", { skip: !hasBun }, () => {
  assertSpawnOutput(bun, [writeStderr], "stderr");
});

test("process::stdin.readSync in node child process", async () => {
  await assertStdinEcho(node, readStdin);
});

test("process::stdin.readSync in bun child process", { skip: !hasBun }, async () => {
  await assertStdinEcho(bun, readStdin);
});

test("process::stdin.read in node child process", async () => {
  await assertStdinEcho(node, readStdinAsync);
});

test("process::stdin.read in bun child process", { skip: !hasBun }, async () => {
  await assertStdinEcho(bun, readStdinAsync);
});

test("process::stdin async iterator in node child process", async () => {
  await assertStdinEcho(node, readStdinIterator);
});

test("process::stdin async iterator in bun child process", { skip: !hasBun }, async () => {
  await assertStdinEcho(bun, readStdinIterator);
});
