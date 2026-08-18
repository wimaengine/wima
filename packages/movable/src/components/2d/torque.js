import { Angle } from '@wimaengine/math'

export class Torque2D extends Angle {

  /**
   * @param {Torque2D} source
   * @param {Torque2D} target
   */
  static copy(source, target = new Torque2D()) {
    target.value = source.value

    return target
  }

  /**
   * @param {Torque2D} target
   */
  static clone(target) {
    return Torque2D.copy(target)
  }

  /**
   * @param {Torque2D} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('@wimaengine/math').AngleLike} value
   * @param {Torque2D} [out]
   */
  static deserialize(value, out = new Torque2D()) {
    return super.deserialize(/** @type {any} */ (value), out)
  }
}
