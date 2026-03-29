import { Quaternion } from '../../../math/index.js'

export class Orientation3D extends Quaternion {

  /**
   * @param {Orientation3D} source
   * @param {Orientation3D} target
   */
  static copy(source, target = new Orientation3D()) {
    return super.copy(source, target)
  }

  /**
   * @param {Orientation3D} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
