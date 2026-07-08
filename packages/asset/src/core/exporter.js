/** @import { TypeRegistry } from '@wimaengine/reflect' */
/** @import { Constructor } from '@wimaengine/type' */
import { throws } from '@wimaengine/logger'

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
