import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["es"],
  loader: {
    ".html": "text",
  },
});
