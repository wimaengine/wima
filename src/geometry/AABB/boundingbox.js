import { BoundType } from './boundtype.js'
import { Vector2 } from '../../math/vector2.js'
import { deprecate } from '../../logger/index.js'

/**
 * A 2d axis aligned bounding box.
 */
export class BoundingBox2D {
  type = BoundType.Box2D

/**
 * The upper limit of the bounding box.
 *
 * @type {Vector2}
 */
  max

/**
 * The lower limit of the bounding box.
 *
 * @type {Vector2}
 */
  min

/**
 * @param {number} [minX=0]
 * @param {number} [minY=0]
 * @param {number} [maxX=0]
 * @param {number} [maxY=0]
 */
  constructor(minX = 0, minY = 0, maxX = 0, maxY = 0) {
    this.max = new Vector2(maxX, maxY)
    this.min = new Vector2(minX, minY)
  }

/**
 * @deprecated
 * @param {number} x
 * @param {number} y
 */
  translate(x, y) {
    deprecate('BoundingBox2D().translate()', 'BoundingBox2D.translate()')

    return BoundingBox2D.translate(this, x, y, this)
  }

/**
 * Deep copies a bounding box to a new one.
 *
 * @deprecated
 * @returns {BoundingBox2D}
 */
  clone() {
    deprecate('BoundingBox2D().clone()', 'BoundingBox2D.copy()')

    return BoundingBox2D.copy(this)
  }

/**
 * Deep copies another bounding box.
 *
 * @deprecated
 * @param {BoundingBox2D} bounds
 */
  copy(bounds) {
    deprecate('BoundingBox2D().copy()', 'BoundingBox2D.copy()')
    BoundingBox2D.copy(bounds, this)
  }

/**
 * @param {BoundingBox2D} bound
 * @param {BoundingBox2D} [out]
 */
  static copy(bound, out = new BoundingBox2D()) {
    out.min.x = bound.min.x
    out.min.y = bound.min.y
    out.max.x = bound.max.x
    out.max.y = bound.max.y

    return out
  }

/**
 * @param {BoundingBox2D} bound
 * @param {number} x
 * @param {number} y
 * @param {BoundingBox2D} [out]
 */
  static translate(bound, x, y, out = new BoundingBox2D()) {
    out.min.x = bound.min.x + x
    out.min.y = bound.min.y + y
    out.max.x = bound.max.x + x
    out.max.y = bound.max.y + y

    return out
  }

/**
 * Combines two bounds to create a new one that covers the previous two.
 *
 * @param {BoundingBox2D} bound1
 * @param {BoundingBox2D} bound2
 * @param {BoundingBox2D} out - Bound to store results into.
 * @returns {BoundingBox2D}
 */
  static union(bound1, bound2, out = new BoundingBox2D()) {
    out.max.x = bound1.max.x > bound2.max.x ? bound1.max.x : bound2.max.x
    out.max.y = bound1.max.y > bound2.max.y ? bound1.max.y : bound2.max.y
    out.min.x = bound1.min.x < bound2.min.x ? bound1.min.x : bound2.min.x
    out.min.y = bound1.min.y < bound2.min.y ? bound1.min.y : bound2.min.y

    return out
  }
}