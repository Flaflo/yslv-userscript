import fs from "node:fs"
import path from "node:path"
import archiver from "archiver"

export async function zipDir(srcDir, outFile) {
  await fs.promises.mkdir(path.dirname(outFile), { recursive: true })

  const output = fs.createWriteStream(outFile)
  const archive = archiver("zip", { zlib: { level: 9 } })

  return new Promise((resolve, reject) => {
    output.on("close", resolve)
    output.on("error", reject)

    archive.on("error", reject)
    archive.pipe(output)

    archive.directory(srcDir, "", undefined)

    void archive.finalize()
  })
}
