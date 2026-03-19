import { Vector2, Vector3 } from '../../../math/index.js'

export class PointerWheel {

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
   * @type {Vector3}
   */
  delta

  /**
   * @param {WheelEvent} event
   */
  constructor(event) {
    this.pointerType = 'mouse'
    this.position.set(event.offsetX, event.offsetY)
    this.delta = new Vector3(
      event.deltaX,
      event.deltaY,
      event.deltaZ
    )
  }
}
