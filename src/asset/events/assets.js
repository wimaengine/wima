/** @import { AssetId } from '../types/index.js' */
/** @import { Constructor } from '../../reflect/index.js' */

/**
 * @abstract
 * @template T
 */
export class AssetEvent {

  /**
   * @type {AssetId}
   */
  id

  /**
   * @type {Constructor<T>}
   */
  type

  /**
   * @param {Constructor<T>} type 
   * @param {AssetId} handle
   */
  constructor(type, handle) {
    this.id = handle
    this.type = type
  }
}