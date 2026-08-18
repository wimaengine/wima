import { Vector2 } from '@wimaengine/math'
import { BoundType } from './boundtype'

/**
 * A circular 2d bound.
 */
export class BoundingCircle {
  type = BoundType.Circle

  /**
   * @type {number}
   */
  r = 0

  /**
   * @type {Vector2}
   */
  pos

  /**
   * @param {number} [x]
   * @param {number} [y]
   * @param {number} [r]
   */
  constructor(x = 0, y = 0, r = 0) {
    this.r = r
    this.pos = new Vector2(x, y)
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  translate(x, y) {
    BoundingCircle.translate(this, x, y, this)
  }

  /**
   * @param {BoundingCircle} bound
   */
  copy(bound) {
    BoundingCircle.copy(bound, this)
  }

  /**
   * @param {BoundingCircle} bound
   * @param {number} x
   * @param {number} y
   * @param {BoundingCircle} [out]
   */
  static translate(bound, x, y, out = new BoundingCircle()) {
    out.pos.x = bound.pos.x + x
    out.pos.y = bound.pos.y + y

    return out
  }

  /**
   * @param {BoundingCircle} bound
   * @param {BoundingCircle} [out]
   */
  static copy(bound, out = new BoundingCircle()) {
    out.pos.x = bound.pos.x
    out.pos.y = bound.pos.y
    out.r = bound.r

    return out
  }

  /**
   * @param {BoundingCircle} value
   */
  static serialize(value) {
    return {
      r: value.r,
      pos: Vector2.serialize(value.pos)
    }
  }

  /**
   * @param {BoundingCircleSerial} value
   * @param {BoundingCircle} [out]
   */
  static deserialize(value, out = new BoundingCircle()) {
    out.r = value.r
    Vector2.deserialize(value.pos, out.pos)

    return out
  }

  /**
   * @param {unknown} value
   * @returns {value is BoundingCircleSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('r' in value) || !('pos' in value)) {
      return false
    }

    return typeof value.r === 'number' &&
      Vector2.validateSerial(value.pos)
  }
}

/**
 * @typedef BoundingCircleSerial
 * @property {number} type
 * @property {number} r
 * @property {import('@wimaengine/math').Vector2Like} pos
 */
