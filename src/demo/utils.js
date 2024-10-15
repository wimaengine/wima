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