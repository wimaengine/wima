import { Vector3 } from '../../../math/index.js'

export class Velocity3D extends Vector3 {

  /**
   * @param {Velocity3D} source
   * @param {Velocity3D} target
   */
  static copy(source, target = new Velocity3D()) {
    return super.copy(source, target)
  }

  /**
   * @param {Velocity3D} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
