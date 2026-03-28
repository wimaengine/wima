import { Vector3 } from '../../../math/index.js'

export class Torque3D extends Vector3 {

  /**
   * @param {Torque3D} source
   * @param {Torque3D} target
   */
  static copy(source, target = new Torque3D()) {
    return super.copy(source, target)
  }

  /**
   * @param {Torque3D} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
