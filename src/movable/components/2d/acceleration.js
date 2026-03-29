import { Vector2 } from '../../../math/index.js'

export class Acceleration2D extends Vector2 {

  /**
   * @param {Acceleration2D} source
   * @param {Acceleration2D} target
   */
  static copy(source, target = new Acceleration2D()) {
    return super.copy(source, target)
  }

  /**
   * @param {Acceleration2D} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
