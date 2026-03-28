import { Affine2 } from '../../../math/index.js'

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
    return this.copy(target)
  }
}
