import { Vector2 } from '../../../math/index.js'

export class PointerMove {

  /**
   * @readonly
   * @type {number}
   */
  id

  /**
   * @readonly
   * @type {string}
   */
  pointerType

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
   * @param {PointerEvent} event
   */
  constructor(event) {
    this.id = event.pointerId
    this.pointerType = event.pointerType
    this.position.set(event.offsetX, event.offsetY)
    this.delta.set(event.movementX, event.movementY)
  }
}
