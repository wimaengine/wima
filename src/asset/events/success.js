/**@import {TypeId} from '../../reflect/index.js' */
/**@import {AssetId} from '../types/index.js' */

export class AssetLoadSuccess {
  
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