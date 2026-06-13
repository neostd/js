import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";

const dir = join(import.meta.dirname, "..", "..");
const runner = join(dir, "eng", "scripts", "node-test-runner.mjs");
const nodeTestShim = fileURLToPath(new URL("../../eng/scripts/node-test-shim.ts", import.meta.url));

export default defineConfig({
  pack: {
    dts: {
      tsgo: true,
    },
    entry: [
      "./src/args.ts",
      "./src/chdir.ts",
      "./src/cwd.ts",
      "./src/env.ts",
      "./src/exec-path.ts",
      "./src/exit.ts",
      "./src/globals.ts",
      "./src/history.ts",
      "./src/index.ts",
      "./src/kill.ts",
      "./src/pid.ts",
      "./src/popd.ts",
      "./src/pushd.ts",
      "./src/streams.ts",
      "./src/title.ts",
    ],
    exports: {
      exclude: ["globals", "history"],
    },
    outDir: "esm",
    platform: "node",
  },
  test: {
    runner,
  },
  resolve: {
    alias: {
      "node:test": nodeTestShim,
    },
  },
});
