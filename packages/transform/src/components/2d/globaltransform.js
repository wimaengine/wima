import { Affine2 } from '@wimaengine/math'

export class GlobalTransform2D extends Affine2 {

  /**
   * @param {GlobalTransform2D} source
   * @param {GlobalTransform2D} target
   */
  static copy(source, target = new GlobalTransform2D()) {
    return super.copy(source, target)
  }

  /**
   * @param {GlobalTransform2D} target
   */
  static clone(target) {
    return GlobalTransform2D.copy(target)
  }

  /**
   * @param {GlobalTransform2D} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('@wimaengine/math').Affine2Serial} value
   * @param {GlobalTransform2D} [out]
   */
  static deserialize(value, out = new GlobalTransform2D()) {
    return super.deserialize(value, out)
  }
}
