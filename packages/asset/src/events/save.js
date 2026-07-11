/** @import {TypeId} from '@wimaengine/type' */
/** @import {AssetId} from '../types' */

export class AssetSaveSuccess {

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
   * @param {TypeId} typeId
   * @param {AssetId} assetId
   * @param {string} path
   */
  constructor(typeId, assetId, path) {
    this.path = path
    this.typeId = typeId
    this.assetId = assetId
  }
}
