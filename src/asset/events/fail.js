/**@import {TypeId} from '../../reflect/index.js' */
/**@import {AssetId} from '../types/index.js' */
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
   * @param {TypeId} typeId
   * @param {AssetId} assetId
   * @param {string} path
   * @param {string} reason
   */
  constructor(typeId, assetId, path, reason) {
    this.typeId = typeId
    this.assetId = assetId
    this.path = path
    this.reason = reason
  }
}