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

/**
 * @template T
 * @augments AssetEvent<T>
 */
export class AssetAdded extends AssetEvent { }

/**
 * @template T
 * @augments AssetEvent<T>
 */
export class AssetModified extends AssetEvent { }

/**
 * @template T
 * @augments AssetEvent<T>
 */
export class AssetDropped extends AssetEvent { }