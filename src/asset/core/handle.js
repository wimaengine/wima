/** @import {AssetId} from '../types/index.js' */

/**
 * @template T
 */
export class Handle {

  /**
   * @readonly
   * @type {number}
   */
  index

  /**
   * @type {T | undefined}
   */
  #placeholder

  /**
   * @param {number} index 
   */
  constructor(index){
    this.index = index


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