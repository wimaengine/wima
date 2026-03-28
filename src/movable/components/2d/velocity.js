import { Vector2 } from '../../../math/index.js'

export class Velocity2D extends Vector2 {

  /**
   * @param {Velocity2D} source
   * @param {Velocity2D} target
   */
  static copy(source, target = new Velocity2D()) {
    return super.copy(source, target)
  }

  /**
   * @param {Velocity2D} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
