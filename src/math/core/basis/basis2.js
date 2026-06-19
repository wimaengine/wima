import { Vector2 } from '../vectors/index.js'

export class Basis2 {

  /**
   * @type {Vector2}
   */
  x

  /**
   * @type {Vector2}
   */
  y

  /**
   * @param {Vector2} x
   * @param {Vector2} y
   */
  constructor(x = new Vector2(1, 0), y = new Vector2(0, 1)) {
    this.x = x
    this.y = y
  }

  /**
   * @param {Basis2} value
   */
  static serialize(value) {
    return {
      x: Vector2.serialize(value.x),
      y: Vector2.serialize(value.y)
    }
  }

  /**
   * @param {Basis2Serial} value
   * @param {Basis2} [out]
   */
  static deserialize(value, out = new Basis2()) {
    out.x = Vector2.deserialize(value.x, out.x)
    out.y = Vector2.deserialize(value.y, out.y)

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is Basis2Serial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('x' in value) || !('y' in value)) {
      return false
    }

    return Vector2.validateSerial(value.x) &&
      Vector2.validateSerial(value.y)
  }
}

/**
 * Serialized form of `Basis2`.
 *
 * @typedef Basis2Serial
 * @property {any} x
 * @property {any} y
 */
