/** @import { TouchId } from "../typedef" */
import { Vector2 } from '@wimaengine/math'

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
