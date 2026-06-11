import { Vector3 } from '../vectors/index.js'

export class Basis3 {

  /**
   * @type {Vector3}
   */
  x

  /**
   * @type {Vector3}
   */
  y

  /**
   * @type {Vector3}
   */
  z
  constructor(
    x = new Vector3(1, 0, 0),
    y = new Vector3(0, 1, 0),
    z = new Vector3(0, 0, 1)
  ) {
    this.x = x
    this.y = y
    this.z = z
  }

  /**
   * @param {Basis3} value
   */
  static serialize(value) {
    return {
      x: Vector3.serialize(value.x),
      y: Vector3.serialize(value.y),
      z: Vector3.serialize(value.z)
    }
  }

  /**
   * @param {Basis3Serial} value
   * @param {Basis3} [out]
   */
  static deserialize(value, out = new Basis3()) {
    out.x = Vector3.deserialize(value.x, out.x)
    out.y = Vector3.deserialize(value.y, out.y)
    out.z = Vector3.deserialize(value.z, out.z)

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is Basis3Serial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('x' in value) || !('y' in value) || !('z' in value)) {
      return false
    }

    return Vector3.validateSerial(value.x)
      && Vector3.validateSerial(value.y)
      && Vector3.validateSerial(value.z)
  }
}

/**
 * Serialized form of `Basis3`.
 *
 * @typedef Basis3Serial
 * @property {any} x
 * @property {any} y
 * @property {any} z
 */
