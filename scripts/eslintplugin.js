/**
 * To use this plugin, ensure that types are wrapped in curly braces e.g 
 * "type {object}"
 * "param {object}"
 * "returns {object}"
 * 
 * @type {EslintPlugin}
 */
const plugin = {
    meta: {
        name: "mark-import"
    },
    rules: {
        "mark-import": {
            create(context) {
                const { sourceCode } = context
                const importtokens = getValidImports(sourceCode.text)
                const tokens = getUses(sourceCode.getAllComments().filter(e => e.type === "Block"))

                importtokens
                    .filter(e => {
                        for (const token of tokens) {
                            if (token.includes(e)) return true
                        }
                        return false
                    })
                    .forEach(e => context.sourceCode.markVariableAsUsed(e))

                return {}
            }
        }
    }
}

/**
 * @param {string} input
 * @returns {string[]}
 */
function getValidImports(input) {
    const searchable = "import"
    let position = 0
    let result = []

    while (true) {
        const location = input.indexOf(searchable,position)

        if (location === -1) break

        const start = input.indexOf("{",position) + 1
        const end = input.indexOf("}",start)
        const names = input.slice(start,end).split(",")
            .map(t => t.trim())

        result.push(...names)
        position = end
    }

    return result
}

/**
 * @param {import('estree').Comment[]} input
 * @returns {string[]}
 */
function getUses(input) {
    const results = []

    for (let i = 0; i < input.length; i++) {
        results.push(...getValidParams(input[i].value))
    }

    return results
}

/**
 * @param {string} input
 */
function getValidParams(input) {
    const searchable = "@"
    let position = 0
    let result = []

    while (position !== -1) {
        const location = input.indexOf(searchable,position)

        if (location === -1) break

        const start = input.indexOf("{",position) + 1
        const end = input.indexOf("}",start)

        if (start < location || end < location) break

        const names = input
            .slice(start,end)
            .split(",")
            .map(t => t.trim())

        result.push(...names)
        position = end
    }

    return result
}

export default plugin

/**
 * @typedef {import('eslint').ESLint.Plugin} EslintPlugin
 */