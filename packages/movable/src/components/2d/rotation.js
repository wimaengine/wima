import { Angle } from '@wimaengine/math'

export class Rotation2D extends Angle {

  /**
   * @param {Rotation2D} source
   * @param {Rotation2D} target
   */
  static copy(source, target = new Rotation2D()) {
    target.value = source.value

    return target
  }

  /**
   * @param {Rotation2D} target
   */
  static clone(target) {
    return Rotation2D.copy(target)
  }

  /**
   * @param {Rotation2D} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('@wimaengine/math').AngleSerial} value
   * @param {Rotation2D} [out]
   */
  static deserialize(value, out = new Rotation2D()) {
    return super.deserialize(/** @type {any} */ (value), out)
  }
}
