/**
 * This provides temporary storage when your application tab is open.
 *
 * @module Session
 */
export class Session {

  /**
   * Adds a value to sessions.
   *
   * @param {string} k
   * @param {any} v
   */
  set(k, v) {
    const json = JSON.stringify(v)

    sessionStorage.setItem(k, json)
  }

  /**
   * Gets a value from sessions using a key.
   * @template T
   * @param {string} k - A key to retrieve a value.
   * @returns {T | undefined}
   */
  get(k) {
    const json = sessionStorage.getItem(k)

    if(!json)return undefined

    return JSON.parse(json)
  }

  /**
   * Removes everything from sessions.
   */
  clear() {
    sessionStorage.clear()
  }
}