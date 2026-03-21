import { defineConfig } from "vite"
import svgIconDef from "./plugins/vite-svg-icondef"

export default defineConfig({
  plugins: [svgIconDef()],
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
