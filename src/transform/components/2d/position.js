import { Vector2 } from '../../../math/index.js'

export class Position2D extends Vector2 {

  /**
   * @param {Position2D} source
   * @param {Position2D} target
   */
  static copy(source, target = new Position2D()) {
    return super.copy(source, target)
  }

  /**
   * @param {Position2D} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
