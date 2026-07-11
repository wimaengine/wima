import { Vector3 } from '@wimaengine/math'

export class Torque3D extends Vector3 {

  /**
   * @param {Torque3D} source
   * @param {Torque3D} target
   */
  static copy(source, target = new Torque3D()) {
    return super.copy(source, target)
  }

  /**
   * @param {Torque3D} target
   */
  static clone(target) {
    return Torque3D.copy(target)
  }

  /**
   * @param {Torque3D} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('@wimaengine/math').Vector3Serial} value
   * @param {Torque3D} [out]
   */
  static deserialize(value, out = new Torque3D()) {
    return super.deserialize(/** @type {any} */ (value), out)
  }
}
