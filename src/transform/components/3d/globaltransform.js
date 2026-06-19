import { Affine3 } from '../../../math/index.js'

export class GlobalTransform3D extends Affine3 {

  /**
   * @param {GlobalTransform3D} source
   * @param {GlobalTransform3D} target
   */
  static copy(source, target = new GlobalTransform3D()) {
    return super.copy(source, target)
  }

  /**
   * @param {GlobalTransform3D} target
   */
  static clone(target) {
    return GlobalTransform3D.copy(target)
  }

  /**
   * @param {GlobalTransform3D} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('../../../math/index.js').Affine3Serial} value
   * @param {GlobalTransform3D} [out]
   */
  static deserialize(value, out = new GlobalTransform3D()) {
    return super.deserialize(value, out)
  }
}
