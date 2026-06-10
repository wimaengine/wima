import { lerp } from '../functions/index.js'

/**
 * Wrapper class since JavaScript doesn't support references to numbers explicitly.
 * Keeps record of the orientation of an entity.
 */
export class Angle {

  /**
   * Orientation in radians.
   *
   * @type {number}
   */
  value = 0

  /**
   * @param {number} [rad=0] - Angle in radians.
   */
  constructor(rad = 0) {
    this.value = rad
  }

  /**
   * @param {Angle} a
   * @param {Angle} b
   * @param {number} t
   * @param {Angle} out
   */
  static lerp(a, b, t, out) {
    out.value = lerp(a.value, b.value, t)
  }

  /**
   * Copies the orientation of another angle.
   *
   * @param {Angle} angle
   */
  static copy(angle) {
    this.value = angle.value
  }

  /**
   * @param {Angle} value
   */
  static serialize(value) {
    return value.value
  }

  /**
   * @param {AngleSerial} value
   * @param {Angle} [out]
   */
  static deserialize(value, out = new Angle()) {
    out.value = value

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is AngleSerial}
   */
  static validateSerial(value) {
    return typeof value === 'number'
  }
}

/**
 * Serialized form of `Angle`.
 *
 * @typedef {number} AngleSerial
 */
