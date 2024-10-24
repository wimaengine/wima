/**
 * Used to manipulate and read from the cookie string.
 *
 * @module Cookie
 */

export class Cookies {

  /**
   * Adds a cookie pair to cookies.
   *
   * @param {string} n - Key of the cookie.
   * @param {string} v - The value of the cookie.
   * @param {number} [maxAge=12000] - Max age of the cookie before it is deleted.
   */
  set(n, v, maxAge = 12000) {
    document.cookie = `${n}=${v};maxAge=${maxAge}`
  }

  /**
   * Returns the value of the given key.
   *
   * @param {string} n - Key of the cookie.
   * @returns {string | undefined}
   */
  get(n) {
    const arr = document.cookie.split(';')

    for (let i = 0; i < arr.length; i++) {
      const pair = arr[i].split('=')

      if (pair[0] === n) return pair[1]
    }
  }

  /**
   * Removes a cookie by its key from cookies.
   *
   * @param {string} n - Key of the cookie.
   */
  delete(n) {
    document.cookie = `${n}=; max-age=0`
  }

  /**
   * Removes all cookies that are contained on the document.
   */
  clear() {
    const arr = document.cookie.split(';')

    for (let i = 0; i < arr.length; i++) {
      const pair = arr[i].split('=')

      this.delete(pair[0])
    }
  }
}