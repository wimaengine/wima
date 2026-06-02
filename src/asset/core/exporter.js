/** @import { TypeRegistry } from '../../reflect/resources/index.js' */
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
   * @param {TypeRegistry} _typeRegistry
   * @returns {Promise<BodyInit | undefined>}
   */
  async serialize(_asset, _typeRegistry) {
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
