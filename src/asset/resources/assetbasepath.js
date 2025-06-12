/**
 * @template T
 */
export class AssetBasePath {

  /**
   * @private
   * @type {T | undefined}
   */
  marker

  /**
   * @type {string}
   */
  path = ''

  /**
   * @param {string} path
   */
  constructor(path) {
    this.path = path
  }
}