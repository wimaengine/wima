import { Vector2 } from '../../math/index.js'

/**
 * This handles all inputs from mouse and touchpad on PC and laptop.
 */
export class Mouse {

  /**
   * Distance vector between the last frame's position and current position.
   * 
   * @type {Vector2}
   */
  lastPosition = new Vector2()
  
  /**
   * Position of the mouse in current frame.
   * 
   * @type {Vector2}
   */
  position = new Vector2()

  /**
   * @type {Vector2}
   * 
   */
  delta = new Vector2()

  /**
   * @returns {boolean}
   */
  moved(){
    return !this.delta.equals(Vector2.ZERO)
  }
}
  