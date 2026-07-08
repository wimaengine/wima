import { Vector2 } from '@wimaengine/math'

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
    return Position2D.copy(target)
  }

  /**
   * @param {Position2D} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('@wimaengine/math').Vector2Serial} value
   * @param {Position2D} [out]
   */
  static deserialize(value, out = new Position2D()) {
    return super.deserialize(value, out)
  }
}
