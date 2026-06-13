import { fileURLToPath } from "url";
import { defineConfig } from "vite-plus";

const dir = import.meta.dirname;


const nodeTestShim = fileURLToPath(new URL("./tools/node-test-shim.ts", import.meta.url));

export default defineConfig({
  test: {
    runner: dir + "/tools/node-test-runner.mjs",
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
        }
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
  }
});
