/** @import { TouchId } from "../typedef/index.js" */
import { Vector2 } from '../../math/index.js'

export class TouchPointer {

  /**
   * @readonly
   * @type {TouchId}
   */
  id = 0
  
  /**
   * @type {Vector2}
   */
  position = new Vector2()
  
  /**
   * @type {Vector2}
   */
  lastposition = new Vector2()
  
  /**
   * @param {number} id
   */
  constructor(id) {
    this.id = id
  }
}