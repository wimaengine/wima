import { Angle } from '../../../math/index.js'

export class Rotation2D extends Angle {

  /**
   * @param {Rotation2D} source
   * @param {Rotation2D} target
   */
  static copy(source, target = new Rotation2D()) {
    target.value = source.value

    return target
  }

  /**
   * @param {Rotation2D} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
