/** @import { TypeRegistry } from '../../reflect/resources/index.js' */
/** @import { Constructor } from '../../type/index.js' */
import { throws } from '../../logger/index.js'

/**
 * @abstract
 * @template T
 */
export class Parser {

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
   * @param {Response} _response
   * @param {TypeRegistry} _typeRegistry
   * @returns {Promise<T | undefined>}
   */
  async parse(_response, _typeRegistry) {
    throws(`Implement the method \`parse\` on \`${this.constructor.name}\``)

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
