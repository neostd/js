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
      "./src/credential.ts",
      "./src/ffi_bun.ts",
      "./src/ffi_deno.ts",
      "./src/ffi_koffi.ts",
      "./src/ffi_node.ts",
      "./src/index.ts",
      "./src/types.ts",
    ],
    exports: {
      exclude: ["./ffi_bun", "./ffi_deno", "./ffi_koffi", "./ffi_node"],
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
