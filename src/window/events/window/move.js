import { Vector2 } from '../../../math/index.js'

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
  constructor(x, y){
    this.position.set(x, y)
  }
}