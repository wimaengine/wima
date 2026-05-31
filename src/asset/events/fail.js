/** @import {TypeId} from '../../type/index.js' */
/** @import {AssetId} from '../types/index.js' */

/**
 * @readonly
 * @enum {number}
 */
export const AssetLoadOperation = {
  Loading: 1,
  Saving: 2
}

export class AssetLoadFail {

  /**
   * @type {TypeId}
   */
  typeId

  /**
   * @type {AssetId}
   */
  assetId

  /**
   * @type {string}
   */
  path

  /**
   * @type {string}
   */
  reason

  /**
   * @type {number}
   */
  operation

  /**
   * @param {TypeId} typeId
   * @param {AssetId} assetId
   * @param {string} path
   * @param {string} reason
   * @param {number} [operation=AssetLoadOperation.Loading]
   */
  constructor(typeId, assetId, path, reason, operation = AssetLoadOperation.Loading) {
    this.typeId = typeId
    this.assetId = assetId
    this.path = path
    this.reason = reason
    this.operation = operation
  }
}
