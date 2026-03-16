import samples from './samples/index.js'

init()

/**
 *
 */
function init() {
  const params = new URLSearchParams(window.location.search)
  const name = params.get('example')

  if (!name || name === '') {
    const warning = 'No example selected.'

    document.body.append(document.createTextNode(warning))

    return
  }

  const demo = recursiveSelect(
    name.split('/').filter((e) => e.length !== 0),
    samples
  )

  if (!demo) {
    const warning = 'The example selected does not exist.'

    document.body.append(document.createTextNode(warning))

    return
  }

  const script = document.createElement('script')

  script.type = 'module'
  script.src = demo
  document.head.append(script)
}

/**
 * @param {string[]} items
 * @param {Record<string,any>} map
 * @returns {string | undefined}
 */
function recursiveSelect(items, map) {
  const name = items.shift()

  if (!name) {
    return undefined
  }

  const item = map[name]

  if (item instanceof URL) {
    return item.pathname
  }
  if (item === undefined) {
    return undefined
  }

  return recursiveSelect(items, item)
}
