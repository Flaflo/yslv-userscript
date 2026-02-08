import fs from "node:fs"

const headerPath = "userscript.header.txt"
const outFile = "dist/yslv.user.js"

const header = fs.readFileSync(headerPath, "utf8").trimEnd() + "\n\n"
const body = fs.readFileSync(outFile, "utf8")

const cleaned = body.replace(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\s*/m, "")

fs.writeFileSync(outFile, header + cleaned)
