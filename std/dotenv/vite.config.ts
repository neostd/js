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
      "./src/document.ts",
      "./src/expand.ts",
      "./src/globals.ts",
      "./src/index.ts",
      "./src/load.ts",
      "./src/parse_document.ts",
      "./src/parse.ts",
      "./src/stringify_document.ts",
      "./src/stringify.ts",
    ],
    exports: {
      exclude: ["./globals"],
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
