import { Vector2 } from '../../../math/index.js'

export class MouseMove {
  
  /**
   * @readonly
   * @type {Vector2}
   */
  position = new Vector2()

  /**
   * @readonly
   * @type {Vector2}
   */
  delta = new Vector2()
  
  /**
   * @param {MouseEvent} event
   */
  constructor(event) {
    this.position.set(event.x, event.y)
    this.delta.set(event.movementX,event.movementY)
  }
}