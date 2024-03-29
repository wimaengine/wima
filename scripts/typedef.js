import { readFileSync, writeFileSync, readdirSync } from "fs"
import { join, resolve } from "path"

//removeTypeDefImport("dist")
concatTypedefs(resolve(process.cwd(), "src"), resolve(process.cwd(), "dist"))

/**
 * @param {string} input
 * @param {string} output
 */
function concatTypedefs(input, output) {
    const files = readdirSync(input, { recursive: true })
        .filter(str => str.includes("typedef"))
        .filter(path => path.includes(".js"))
    const outputfiles = readdirSync(output)
    let blob = ""

    for (const file of files) {
        blob += readFileSync(join(input, file.toString()), { encoding: "utf-8" }) + "\n"
    }

    for (const filename of outputfiles) {
        if (filename.includes(".d.ts") || filename.includes(".min.")) continue

        const acc = readFileSync(join(output, filename), { encoding: "utf-8" }) + blob

        writeFileSync(join(output, filename), acc)
    }
}

/**
 * @param {string} input
 */
function removeTypeDefImport(input) {
    const paths = readdirSync(input)
        .filter(path => !path.includes(".min."))
        .filter(path => !path.includes(".d.ts"))
        .filter(path => !path.includes(".umd."))
        .map(path => resolve(input, path))

    for (let i = 0; i < paths.length; i++) {
        const path = paths[i]

        const output = cut(readFileSync(path).toString())

        writeFileSync(path, output)
    }
}

/**
 * @param {string} input
 */
function cut(input) {
    const searchable = "@typedef"
    let position = 0
    let result = ""

    while (true) {
        const location = input.indexOf(searchable, position)

        if (location === -1) break

        const start = input.indexOf("/**", position)
        const end = input.indexOf("*/", location) + 2

        if (input.slice(start, end).match("import")){
            position = end
            continue
        }

        result += input.slice(position, end)
        position = end

    }
    result += input.slice(position)

    return result
}