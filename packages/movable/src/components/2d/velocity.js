import { Vector2 } from '@wimaengine/math'

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
    return Velocity2D.copy(target)
  }

  /**
   * @param {Velocity2D} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('@wimaengine/math').Vector2Like} value
   * @param {Velocity2D} [out]
   */
  static deserialize(value, out = new Velocity2D()) {
    return super.deserialize(/** @type {any} */ (value), out)
  }
}
