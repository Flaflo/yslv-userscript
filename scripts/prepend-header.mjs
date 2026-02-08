import fs from "node:fs"
import path from "node:path";

const ROOT = process.cwd()

const headerPath = "userscript.header.txt"
const outFile = "dist/yslv.user.js"

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"))
const version = String(pkg.version || "0.0.0")

const header = fs.readFileSync(headerPath, "utf8").replaceAll("__VERSION__", version).trimEnd() + "\n\n"
const body = fs.readFileSync(outFile, "utf8")

const cleaned = body.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\s*/m, "")

fs.writeFileSync(outFile, header + cleaned)
