import { Vector3 } from '../../../math/index.js'

export class Rotation3D extends Vector3 {

  /**
   * @param {Rotation3D} source
   * @param {Rotation3D} target
   */
  static copy(source, target = new Rotation3D()) {
    return super.copy(source, target)
  }

  /**
   * @param {Rotation3D} target
   */
  static clone(target) {
    return Rotation3D.copy(target)
  }

  /**
   * @param {Rotation3D} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('../../../math/core/vectors/float/vector3.js').Vector3Serial} value
   * @param {Rotation3D} [out]
   */
  static deserialize(value, out = new Rotation3D()) {
    return super.deserialize(/** @type {any} */ (value), out)
  }
}
