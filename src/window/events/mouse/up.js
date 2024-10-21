import { Vector2 } from '../../../math/index.js'

export class MouseUp {
  
  /**
   * @readonly
   * @type {number}
   */
  key
  
  /**
   * @readonly
   * @type {Vector2}
   */
  position = new Vector2()
  
  /**
   * @param {MouseEvent} event
   */
  constructor(event) {
    this.key = event.button
    this.position.set(event.x, event.y)
  }
}