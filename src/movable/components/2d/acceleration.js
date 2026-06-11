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
    return Acceleration2D.copy(target)
  }

  /**
   * @param {Acceleration2D} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('../../../math/core/vectors/float/vector2.js').Vector2Serial} value
   * @param {Acceleration2D} [out]
   */
  static deserialize(value, out = new Acceleration2D()) {
    return super.deserialize(/** @type {any} */ (value), out)
  }
}
