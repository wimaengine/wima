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
}