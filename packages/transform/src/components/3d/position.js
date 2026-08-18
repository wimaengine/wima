import { Vector3 } from '@wimaengine/math'

export class Position3D extends Vector3 {

  /**
   * @param {Position3D} source
   * @param {Position3D} target
   */
  static copy(source, target = new Position3D()) {
    return super.copy(source, target)
  }

  /**
   * @param {Position3D} target
   */
  static clone(target) {
    return Position3D.copy(target)
  }

  /**
   * @param {Position3D} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('@wimaengine/math').Vector3Like} value
   * @param {Position3D} [out]
   */
  static deserialize(value, out = new Position3D()) {
    return super.deserialize(value, out)
  }
}
