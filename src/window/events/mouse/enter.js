import { Vector2 } from '../../../math/index.js'

export class MouseEnter {

  /**
   * @readonly
   * @type {Vector2}
   */
  position = new Vector2()
  
  /**
   * @param {MouseEvent} event
   */
  constructor(event) {
    this.position.set(event.x, event.y)
  }
}