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
    return this.copy(target)
  }
}
