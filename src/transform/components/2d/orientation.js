import { Rotary } from '../../../math/index.js'

export class Orientation2D extends Rotary {

  /**
   * @param {Orientation2D} source
   * @param {Orientation2D} target
   */
  static copy(source, target = new Orientation2D()) {
    return super.copy(source, target)
  }

  /**
   * @param {Orientation2D} target
   */
  static clone(target) {
    return this.copy(target)
  }
}
