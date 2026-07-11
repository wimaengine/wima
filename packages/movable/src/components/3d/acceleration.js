import { Vector3 } from '@wimaengine/math'

export class Acceleration3D extends Vector3 {

  /**
   * @param {Acceleration3D} source
   * @param {Acceleration3D} target
   */
  static copy(source, target = new Acceleration3D()) {
    return super.copy(source, target)
  }

  /**
   * @param {Acceleration3D} target
   */
  static clone(target) {
    return Acceleration3D.copy(target)
  }

  /**
   * @param {Acceleration3D} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('@wimaengine/math').Vector3Serial} value
   * @param {Acceleration3D} [out]
   */
  static deserialize(value, out = new Acceleration3D()) {
    return super.deserialize(/** @type {any} */ (value), out)
  }
}
