import { Vector3 } from '../../../math/index.js'

export class MouseWheel {

  /**
   * @readonly
   * @type {Vector3}
   */
  delta

  /**
   * @param {WheelEvent} event
   */
  constructor(event) {
    this.delta = new Vector3(
      event.deltaX,
      event.deltaY,
      event.deltaZ
    )
  }
}