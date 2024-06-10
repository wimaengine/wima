import { BoundType } from './boundtype.js'
import { Vector2 } from '../../math/vector2.js'

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
  copy(bound){
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
}