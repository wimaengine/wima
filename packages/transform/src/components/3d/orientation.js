import { Quaternion } from '@wimaengine/math'

export class Orientation3D extends Quaternion {

  /**
   * @param {Orientation3D} source
   * @param {Orientation3D} target
   */
  static copy(source, target = new Orientation3D()) {
    return super.copy(source, target)
  }

  /**
   * @param {Orientation3D} target
   */
  static clone(target) {
    return Orientation3D.copy(target)
  }

  /**
   * @param {Orientation3D} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('@wimaengine/math').QuaternionLike} value
   * @param {Orientation3D} [out]
   */
  static deserialize(value, out = new Orientation3D()) {
    return super.deserialize(value, out)
  }
}
