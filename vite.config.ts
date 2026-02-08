import { defineConfig } from "vite"
import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

function prependUserscriptHeader() {
  return {
    name: "prepend-userscript-header",
    apply: "build",
    closeBundle() {
      const outFile = resolve("dist/yslv.user.js")
      const headerFile = resolve("userscript.header.txt")

      let header = ""
      try {
        header = readFileSync(headerFile, "utf-8")
      } catch {
        header = ""
      }

      const body = readFileSync(outFile, "utf-8")
      const trimmedHeader = header.trimEnd() + "\n\n"
      const already = body.startsWith("// ==UserScript==")
      const next = already ? body : trimmedHeader + body
      writeFileSync(outFile, next, "utf-8")
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
  plugins: [prependUserscriptHeader()],
})
