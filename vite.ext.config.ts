import { defineConfig } from "vite"

export default defineConfig({
  build: {
    outDir: "dist-ext/tmp",
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
    lib: {
      entry: "src/extension/injected.ts",
      formats: ["iife"],
      name: "yslv",
      fileName: () => "injected.js"
    }
  }
})
