/** @import { TouchId } from "../typedef/index.js" */
import { TouchPointer } from '../core/index.js'


/**
 * Handles the touch input of an application from a smartphone,tablet or PCs with touchscreens.
 */
export class Touches {

  /**
   * @private
   * @type {(TouchPointer | null)[]}
   */
  list = new Array(10).fill(null)
  
  /**
   * @returns {TouchPointer | null}
   */
  getFirst() {
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i]) return this.list[i]
    }
  
    return null
  }
  
  /**
   * @returns {TouchPointer | null}
   */
  getLast() {
    for (let i = 9; i >= 0; i--) {
      if (this.list[i]) return this.list[i]
    }
  
    return null
  }
  
  /**
   * @returns {TouchPointer[]}
   */
  getActive() {
    return this.list.filter((e) => e !== null)
  }
  
  /**
   * @param {TouchId} id
   * @param {TouchPointer | null} pointer
   */
  set(id, pointer) {
    this.list[id] = pointer
  }
  
  /**
   * @param {TouchId} id
   * @returns {TouchPointer | null}
   */
  get(id) {
    return this.list[id]
  }
}
  