/**
 * This provides permanent storage.
 */

export class Storage {

  /**
   * Adds a value to local storage.
   *
   * @param {string} k
   * @param {any} v
   */
  set(k, v) {
    const json = JSON.stringify(v)

    localStorage.setItem(k, json)
  }

  /**
   * Gets a value from local storage by its key.
   * @template T
   * @param {string} k
   * @returns {T | undefined}
   */
  get(k) {
    const json = localStorage.getItem(k)

    if(!json)return undefined

    return JSON.parse(json)
  }

  /**
   * Removes everything from local storage .
   */
  clear() {
    localStorage.clear()
  }
}