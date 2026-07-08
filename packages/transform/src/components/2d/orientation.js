import { Rotary } from '@wimaengine/math'

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
    return Orientation2D.copy(target)
  }

  /**
   * @param {Orientation2D} value
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @param {import('@wimaengine/math').RotarySerial} value
   * @param {Orientation2D} [out]
   */
  static deserialize(value, out = new Orientation2D()) {
    return super.deserialize(value, out)
  }
}
