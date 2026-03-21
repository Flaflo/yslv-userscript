import { defineConfig } from "vite"
import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import svgIconDef from "./plugins/vite-svg-icondef"

function prependUserscriptHeader() {
  return {
    name: "prepend-userscript-header",
    apply: "build",
    closeBundle() {
      const outFile = resolve("dist/yslv.user.js")
      const headerFile = resolve("userscript.header.txt")
      const pkgFile = resolve("package.json")

      let header = ""
      try {
        header = readFileSync(headerFile, "utf-8")
      } catch {
        header = ""
      }

      const pkg = JSON.parse(readFileSync(pkgFile, "utf-8"))
      const version = String(pkg.version || "0.0.0")
      header = header.replaceAll("__VERSION__", version)

      const body = readFileSync(outFile, "utf-8")
      const cleaned = body.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\s*/m, "")
      writeFileSync(outFile, header.trimEnd() + "\n\n" + cleaned, "utf-8")
    },
  } as const
}

export default defineConfig({
  build: {
    target: "es2022",
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: false,
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "yslv",
      formats: ["iife"],
      fileName: () => "yslv.user.js",
    },
    rollupOptions: {
      output: {
        extend: false,
      },
    },
  },
  plugins: [svgIconDef(), prependUserscriptHeader()],
})
