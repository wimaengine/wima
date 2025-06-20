import { readFileSync,writeFileSync,readdirSync } from "fs"
import { join,resolve } from "path"

removeImports(resolve(process.cwd(),"dist"))

function removeImports(output) {
    const outputfiles = readdirSync(output)

    for (const filename of outputfiles) {
        if (filename.includes(".d.ts") || filename.includes(".min.")) continue

        const acc = readFileSync(join(output,filename),{ encoding: "utf-8" })

        writeFileSync(join(output,filename),removeterms(acc))
    }
}

/**
 * 
 * @param {string} word 
 */
function removeterms(word) {
    const start = /(?=\/\*\*)/
    const end = '*/'
    const fragments = word
    .split(start)
    .flatMap(
      term=>{
        const terms = term.split(end)
        terms[0] += end
        return terms
      }
    )
    .filter(
      term=> !term.includes('@import')
    )
    const pr = fragments.join("")
    return pr
}