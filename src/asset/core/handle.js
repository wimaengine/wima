/** @import {AssetId} from '../types/index.js' */

/**
 * @template T
 */
export class Handle {

  /**
   * @readonly
   * @type {number}
   */
  handle

  /**
   * @type {T | undefined}
   */
  #placeholder

  /**
   * @param {number} handle 
   */
  constructor(handle){
    this.handle = handle

    // so that ts does not complain about an unused property.
    if(this.#placeholder)this.#placeholder = undefined
  }

  /**
   * @returns {AssetId}
   */
  id(){
    return /** @type {AssetId}*/(this.index)
  }
}