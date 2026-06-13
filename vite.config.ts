import { fileURLToPath } from "url";
import { defineConfig } from "vite-plus";
import { join } from "node:path";

const dir = import.meta.dirname;
const runner = join(dir, "eng", "scripts", "node-test-runner.mjs");

const nodeTestShim = fileURLToPath(new URL("./eng/scripts/node-test-shim.ts", import.meta.url));

export default defineConfig({
  test: {
    runner: runner,
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
    overrides: [
      {
        files: ["**/*.d.mts"],
        rules: {
          "no-unused-private-class-members": "off",
        },
      },
    ],
    rules: {
      "typescript/no-floating-promises": "off",
    },
  },
  fmt: {},
  resolve: {
    alias: {
      "node:test": nodeTestShim,
    },
  },
});
