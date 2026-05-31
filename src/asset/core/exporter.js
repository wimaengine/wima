/** @import { Constructor } from '../../type/index.js' */
import { throws } from '../../logger/index.js'

/**
 * @abstract
 * @template T
 */
export class Exporter {

  /**
   * @readonly
   * @type {Constructor<T>}
   */
  asset

  /**
   * @param {Constructor<T>} asset
   */
  constructor(asset) {
    this.asset = asset
  }

  /**
   * @param {T} _asset
   * @returns {Promise<BodyInit | undefined>}
   */
  async serialize(_asset) {
    throws(`Implement the method \`serialize\` on \`${this.constructor.name}\``)

    return undefined
  }

  /**
   * @returns {string[]}
   */
  getExtensions() {
    throws(`Implement the method \`getExtensions\` on \`${this.constructor.name}\``)

    return []
  }
}
