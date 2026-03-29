import { Vector3 } from '../../../math/index.js'

export class Scale3D extends Vector3 {

  constructor(x = 1, y = 1, z = 1) {
    super(x, y, z)
  }

  /**
   * @param {Scale3D} source
   * @param {Scale3D} target
   */
  static copy(source, target = new Scale3D()) {
    return super.copy(source, target)
  }

  /**
   * @param {Scale3D} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
