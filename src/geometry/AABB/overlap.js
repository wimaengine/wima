import { BoundingBox2D } from './boundingbox.js'
import { BoundingCircle } from './boundingcircle.js'

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

/**
 * Checks if two BoundingCircles overlap.
 *
 * @param {BoundingCircle} a
 * @param {BoundingCircle} b
 */
export function intersectCircle(a, b) {
  const distance = (a.pos.x - b.pos.x) * (a.pos.x - b.pos.x) +
    (a.pos.y - b.pos.y) * (a.pos.y - b.pos.y)

  return distance < a.r * a.r + b.r * b.r
}

/**
 * Checks if An AABB and a CircleBound overlap.
 *
 * @param {BoundingBox2D} a
 * @param {BoundingCircle} b
 */
export function intersectAABB2DvsCircle(a, b) {
  const x = Math.max(a.min.x, Math.min(b.pos.x, a.max.x))
  const y = Math.max(a.min.y, Math.min(b.pos.y, a.max.y))
  const distance =
    (x - b.pos.x) * (x - b.pos.x) +
    (y - b.pos.y) * (y - b.pos.y)

  return distance < b.r * b.r
}