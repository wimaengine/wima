import { Vector3 } from '@wimaengine/math'

export class Velocity3D extends Vector3 {

  /**
   * @param {Velocity3D} source
   * @param {Velocity3D} target
   */
  static copy(source, target = new Velocity3D()) {
    return super.copy(source, target)
  }

  /**
   * @param {Velocity3D} target
   */
  static clone(target) {
    return Velocity3D.copy(target)
  }

  /**
   * @param {Velocity3D} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('@wimaengine/math').Vector3Serial} value
   * @param {Velocity3D} [out]
   */
  static deserialize(value, out = new Velocity3D()) {
    return super.deserialize(/** @type {any} */ (value), out)
  }
}
