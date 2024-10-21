import { Vector2 } from '../../../math/index.js'

export class TouchMove {

  /**
   * @readonly
   * @type {number}
   */
  id

  /**
   * @readonly
   * @type {Vector2}
   */
  position = new Vector2()

  /**
   * @param {Touch} event
   */
  constructor(event) {
    this.id = event.identifier
    this.position.set(event.clientX, event.clientY)
  }
}