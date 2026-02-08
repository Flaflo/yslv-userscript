import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"
import { zipDir } from "./zipDir.mjs"

const ROOT = process.cwd()
const DIST = path.join(ROOT, "dist-ext")
const TMP = path.join(DIST, "tmp")

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"))
const version = String(pkg.version || "0.0.0")

function replaceVersion(manifestPath) {
  const raw = fs.readFileSync(manifestPath, "utf8")
  fs.writeFileSync(manifestPath, raw.replaceAll("__VERSION__", version), "utf8")
}

function rm(p) {
  fs.rmSync(p, { recursive: true, force: true })
}

function copyDir(src, dst, { exclude = [] } = {}) {
  fs.mkdirSync(dst, { recursive: true })

  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (exclude.includes(e.name)) continue

    const s = path.join(src, e.name)
    const d = path.join(dst, e.name)

    if (e.isDirectory()) {
      copyDir(s, d, { exclude })
    } else if (e.isFile()) {
      fs.copyFileSync(s, d)
    }
  }
}

function mustExist(p, label) {
  if (!fs.existsSync(p)) throw new Error(`${label} missing: ${p}`)
}

rm(DIST)
fs.mkdirSync(TMP, { recursive: true })

execSync("npx vite build --config vite.ext.config.ts", { stdio: "inherit" })

const injected = path.join(TMP, "injected.js")
mustExist(injected, "Bundled injected script")

for (const target of ["chromium", "firefox"]) {
  const outDir = path.join(DIST, target)
  rm(outDir)

  const srcTemplate = path.join(ROOT, "extension", target)
  mustExist(srcTemplate, `Extension template (${target})`)

  copyDir(srcTemplate, outDir)

  const manifestPath = path.join(outDir, "manifest.json")
  mustExist(manifestPath, `manifest.json (${target})`)
  replaceVersion(manifestPath)

  fs.copyFileSync(injected, path.join(outDir, "injected.js"))
}

await zipDir(path.join(DIST, "chromium"), path.join(DIST, "yslv-chromium.zip"))
await zipDir(path.join(DIST, "firefox"), path.join(DIST, "yslv-firefox.zip"))

console.log("\nBuilt extensions: dist-ext/chromium, dist-ext/firefox")
console.log("Zip outputs: dist-ext/yslv-chromium.zip, dist-ext/yslv-firefox.zip")
