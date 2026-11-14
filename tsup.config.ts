import { copyFile } from "node:fs/promises";
import { defineConfig } from "tsup";

// Transpile file-by-file (no bundling) so each output file keeps its own
// module-level "use client" directive. Bundling would merge modules and
// esbuild would drop the directives. Type declarations come from
// `tsc -p tsconfig.build.json` (see the "build" script).
export default defineConfig({
  entry: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.stories.tsx",
    "!src/**/*.test.tsx",
  ],
  bundle: false,
  format: ["esm"],
  target: "es2022",
  outDir: "dist",
  clean: true,
  sourcemap: true,
  dts: false,
  async onSuccess() {
    await copyFile("src/styles/theme.css", "dist/theme.css");
  },
});
