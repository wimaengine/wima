import { Vector3 } from '../../../math/index.js'

export class Acceleration3D extends Vector3 {

  /**
   * @param {Acceleration3D} source
   * @param {Acceleration3D} target
   */
  static copy(source, target = new Acceleration3D()) {
    return super.copy(source, target)
  }

  /**
   * @param {Acceleration3D} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
