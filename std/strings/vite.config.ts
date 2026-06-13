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
      "./src/camelize.ts",
      "./src/capitalize.ts",
      "./src/dasherize.ts",
      "./src/ends-with.ts",
      "./src/equal.ts",
      "./src/index-of.ts",
      "./src/index.ts",
      "./src/inflect.ts",
      "./src/is-empty.ts",
      "./src/is-null.ts",
      "./src/is-space.ts",
      "./src/is-undefined.ts",
      "./src/last-index-of.ts",
      "./src/pascalize.ts",
      "./src/split.ts",
      "./src/starts-with.ts",
      "./src/string-builder.ts",
      "./src/titleize.ts",
      "./src/to-char-array.ts",
      "./src/trim.ts",
      "./src/underscore.ts",
    ],
    exports: true,
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
