// UI functions
/**
 * @param {IterableIterator<any>} options
 * @param {((this: GlobalEventHandlers, ev: Event) => any) | null} onChange
 */
export function createDropDown( options, onChange) {
  const select = document.createElement('select')

  for (const n of options) {
    const option = document.createElement('option')

    option.value = n
    option.innerHTML = n
    select.append(option)
  }

  select.onchange = onChange

  return select
}

/**
 * @param {string} text
 * @param {(this: HTMLInputElement, ev: Event) => any} onInput
 */
export function createCheckbox(text, onInput) {
  const p = document.createElement('p')

  p.classList.add('checkbox')
  const box = p.appendChild(document.createElement('input'))
  const label = p.appendChild(document.createElement('label'))

  box.type = 'checkbox'
  box.addEventListener('change', onInput)
  label.appendChild(document.createTextNode(text))

  return p
}

/**
 * @param {string} text
 * @param {number} min
 * @param {number} max
 * @param {((this: GlobalEventHandlers, ev: Event) => any) | null} onInput
 */
export function createSlider(text, min, max, onInput) {
  const p = document.createElement('p')

  p.classList.add('checkbox')
  const slider = p.appendChild(document.createElement('input'))
  const label = p.appendChild(document.createElement('label'))

  label.appendChild(document.createTextNode(text))
  slider.oninput = onInput
  slider.type = 'range'
  slider.min = min.toString()
  slider.max = max.toString()

  return p
}