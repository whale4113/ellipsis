import { defineConfig } from "tsdown";
import { fileURLToPath } from "node:url";

export default defineConfig({
  entry: ["./src/index.ts"],
  dts: {
    tsconfig: fileURLToPath(new URL("./tsconfig.lib.json", import.meta.url)),
    sourcemap: true,
  },
});
