import { join } from "path";
import { fileURLToPath } from "url";
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
      "./src/tables/l.ts",
      "./src/tables/latin1.ts",
      "./src/tables/ll.ts",
      "./src/tables/lu.ts",
      "./src/tables/nd.ts",
      "./src/tables/p.ts",
      "./src/tables/s.ts",
      "./src/all.ts",
      "./src/constants.ts",
      "./src/index.ts",
      "./src/is-ascii.ts",
      "./src/is-char.ts",
      "./src/is-control.ts",
      "./src/is-digit.ts",
      "./src/is-latin1.ts",
      "./src/is-letter-or-digit.ts",
      "./src/is-letter.ts",
      "./src/is-lower.ts",
      "./src/is-punc.ts",
      "./src/is-space.ts",
      "./src/is-symbol.ts",
      "./src/is-upper.ts",
      "./src/simple-fold.ts",
      "./src/to-lower.ts",
      "./src/to-upper.ts",
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
  }
});
