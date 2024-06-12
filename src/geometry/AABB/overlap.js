import { BoundingBox2D } from './boundingbox.js'

/**
 * Checks if two AABB overlap.
 *
 * @param {BoundingBox2D} a
 * @param {BoundingBox2D} b
 */
export function intersectAABB2D(a, b) {
  return (
    a.min.x <= b.max.x &&
    a.max.x >= b.min.x &&
    a.min.y <= b.max.y &&
    a.max.y >= b.min.y
  )
}