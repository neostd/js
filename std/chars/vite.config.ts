import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    dts: {
      tsgo: true,
    },
    entry: [
      "./src/tables/case.ts",
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
      "./src/is_ascii.ts",
      "./src/is_char.ts",
      "./src/is_control.ts",
      "./src/is_digit.ts",
      "./src/is_latin1.ts",
      "./src/is_letter_or_digit.ts",
      "./src/is_letter.ts",
      "./src/is_lower.ts",
      "./src/is_punc.ts",
      "./src/is_space.ts",
      "./src/is_symbol.ts",
      "./src/is_upper.ts",
      "./src/simple_fold.ts",
      "./src/to_lower.ts",
      "./src/to_upper.ts",
    ],
    exports: true,
    outDir: "esm",
    platform: "node",
  },
  isBundled: false,
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      "typescript/no-floating-promises": "off",
    },
  },
  fmt: {},
});
