import { Vector2 } from '../../math/index.js'

// This is supposed to be `Image()` but that is already taken.
export class Image {

  /**
   * @type {Uint8ClampedArray}
   */
  raw

  /**
   * @type {Vector2}
   */
  dimensions

  /**
   * @param {Uint8ClampedArray} buffer
   * @param {Vector2} dimensions
   */
  constructor(buffer, dimensions) {
    this.raw = buffer
    this.dimensions = dimensions
  }

  static default() {
    const array = new Uint8ClampedArray([1, 0, 1, 1])

    return new Image(array, new Vector2(1, 1))
  }

  /**
   * @param {Image} value
   */
  static serialize(value) {
    return {
      raw: Array.from(value.raw),
      dimensions: Vector2.serialize(value.dimensions)
    }
  }

  /**
   * @param {ImageSerial} value
   * @param {Image} [out]
   */
  static deserialize(value, out = Image.default()) {
    out.raw = new Uint8ClampedArray(value.raw)
    out.dimensions = Vector2.deserialize(value.dimensions, out.dimensions)

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is ImageSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('raw' in value) || !('dimensions' in value)) {
      return false
    }

    return Array.isArray(value.raw)
      && Vector2.validateSerial(value.dimensions)
  }
}

/**
 * @typedef ImageSerial
 * @property {number[]} raw
 * @property {import('../../math/core/vectors/float/vector2.js').Vector2Serial} dimensions
 */
