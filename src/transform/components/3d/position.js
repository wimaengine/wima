import { Vector3 } from '../../../math/index.js'

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
    return this.copy(target)
  }
}
