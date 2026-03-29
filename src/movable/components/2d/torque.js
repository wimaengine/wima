import { Angle } from '../../../math/index.js'

export class Torque2D extends Angle {

  /**
   * @param {Torque2D} source
   * @param {Torque2D} target
   */
  static copy(source, target = new Torque2D()) {
    target.value = source.value

    return target
  }

  /**
   * @param {Torque2D} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
