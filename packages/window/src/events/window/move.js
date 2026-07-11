import { Vector2 } from '@wimaengine/math'

export class WindowMove {

  /**
   * @readonly
   * @type {Vector2}
   */
  position = new Vector2()

  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.position.set(x, y)
  }
}
