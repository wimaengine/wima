import samples from './samples/index.js'

const container = document.body.appendChild(document.createElement('div'))
const opts = container.appendChild(document.createElement('select'))

container.style.position = 'absolute'
container.style.top = '0px'
container.style.left = '0px'
opts.addEventListener('change', (e) => {
  const { target } = e

  if (!(target instanceof HTMLSelectElement)) return

  localStorage.setItem('play', target.value)

  switchDemo(target.value)
})

/**
 * @param {string} name
 */
async function switchDemo(name) {
  const frame = document.getElementById('example-frame')
  const link = document.getElementById('popper')

  if (!(frame instanceof HTMLIFrameElement)) {
    throw 'The element selected is not an iframe'
  }
  if (!(link instanceof HTMLAnchorElement)) {
    throw 'The element selected is not an anchor'
  }

  const linkSource = `./example.html?example=${name}`

  frame.src = linkSource
  link.href = linkSource
}

/**
 * @param {Record<string, any>} demos
 * @param {string} prefix
 */
function setupOpts(demos, prefix = '') {
  const fix = prefix !== '' ? `${prefix}/` : prefix

  for (const name in demos) {
    const prename = fix + name

    if (demos[name] instanceof URL) {
      const opt = document.createElement('option')

      opt.append(document.createTextNode(fix + name))
      opts.append(opt)
      continue
    }

    setupOpts(demos[name], prename)
  }
}

/**
 * @param {Item} demos
 */
function init(demos) {
  let name = localStorage.getItem('play')

  if (!name) name = Object.keys(demos)[0] || null
  if (!name) return

  switchDemo(name)
}

init(samples)
setupOpts(samples)

/**
 * @typedef {{ [x: string]: URL  | Item}} Item
 */
