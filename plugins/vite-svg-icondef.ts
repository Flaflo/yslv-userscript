import { readFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import type { Plugin } from "vite"

const SUFFIX = "?icondef"

export default function svgIconDef(): Plugin {
  return {
    name: "svg-icondef",
    enforce: "pre",
    resolveId(source, importer) {
      if (!source.endsWith(SUFFIX)) return
      const bare = source.slice(0, -SUFFIX.length)
      const abs = resolve(dirname(importer!), bare)
      return abs + SUFFIX
    },
    load(id) {
      if (!id.endsWith(SUFFIX)) return
      const file = id.slice(0, -SUFFIX.length)
      const svg = readFileSync(file, "utf-8")
      const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 24 24"
      const paths = [...svg.matchAll(/<path[^>]*\bd="([^"]+)"/g)].map(m => m[1])
      return `export default ${JSON.stringify({ viewBox, paths })}`
    },
  }
}
