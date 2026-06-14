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
      "./src/globals.ts",
      "./src/index.ts",
      "./src/inspect.ts",
      "./src/printf.ts",
      "./src/strip_ansi_code.ts",
    ],
    exports: {
      exclude: ["./globals", "./strip_ansi_code"],
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
