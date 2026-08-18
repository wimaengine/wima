import { Vector3 } from '@wimaengine/math'

export class Scale3D extends Vector3 {

  constructor(x = 1, y = 1, z = 1) {
    super(x, y, z)
  }

  /**
   * @param {Scale3D} source
   * @param {Scale3D} target
   */
  static copy(source, target = new Scale3D()) {
    return super.copy(source, target)
  }

  /**
   * @param {Scale3D} target
   */
  static clone(target) {
    return Scale3D.copy(target)
  }

  /**
   * @param {Scale3D} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('@wimaengine/math').Vector3Like} value
   * @param {Scale3D} [out]
   */
  static deserialize(value, out = new Scale3D()) {
    return super.deserialize(value, out)
  }
}
