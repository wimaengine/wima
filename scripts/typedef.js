import { readFileSync,writeFileSync,readdirSync } from "fs"
import { join,resolve } from "path"

concatTypedefs(resolve(process.cwd(),"src"),resolve(process.cwd(),"dist"))

/**
 * @param {string} input
 * @param {string} output
 */
function concatTypedefs(input,output) {
    const files = readdirSync(input,{ recursive: true })
        .filter(str => str.includes("typedef"))
        .filter(path => path.includes(".js"))
        .filter(path => !path.includes("index.js"))
    const outputfiles = readdirSync(output)
    let blob = ""

    for (const file of files) {
        const fragment = readFileSync(join(input,file.toString()),{ encoding: "utf-8" })
        const processedFragment = removeExport(removeNoCheck(fragment))

        blob += "\n" + processedFragment
    }

    for (const filename of outputfiles) {
        if (filename.includes(".d.ts") || filename.includes(".min.")) continue

        const acc = readFileSync(join(output,filename),{ encoding: "utf-8" }) + blob

        writeFileSync(join(output,filename),acc)
    }
}

/**
 * Ensure the exports is in the bottom.
 * @param {string} input 
 * @returns {string}
 */
function removeExport(input) {
    const index = input.lastIndexOf("export")

    if (!input.includes('export')) return input

    return input.slice(0,index)
}

/**
 * Ensure the no-check tag is there.
 * @param {string} input 
 * @returns {string}
 */
function removeNoCheck(input) {
    if(!input.includes('@ts-nocheck')) return input

    return input.slice(input.indexOf("\n") + 1,input.length)
}