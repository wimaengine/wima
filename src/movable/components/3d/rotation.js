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
    return this.copy(target)
  }
}
