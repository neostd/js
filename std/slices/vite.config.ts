import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { defineConfig } from "vite-plus";

const dir = join(import.meta.dirname, "..", "..");
const runner = join(dir, "tools", "node-test-runner.mjs");
const nodeTestShim = fileURLToPath(new URL("../../tools/node-test-shim.ts", import.meta.url));

export default defineConfig({
  pack: {
    dts: {
      tsgo: true,
    },
    entry: [
      "./src/camelize.ts",
      "./src/capitalize.ts",
      "./src/char-array-builder.ts",
      "./src/char-slice.ts",
      "./src/dasherize.ts",
      "./src/ends-with.ts",
      "./src/equal.ts",
      "./src/index-of.ts",
      "./src/last-index-of.ts",
      "./src/index.ts",
      "./src/ordinalize.ts",
      "./src/pascalize.ts",
      "./src/slice.ts",
      "./src/starts-with.ts",
      "./src/titleize.ts",
      "./src/tokens.ts",
      "./src/trim.ts",
      "./src/underscore.ts",
      "./src/utils.ts",
    ],
    exports: true,
    outDir: "esm",
    platform: "node",
  },
  test: {
    runner: runner,
  },
  resolve: {
    alias: {
      "node:test": nodeTestShim,
    },
  },
});
