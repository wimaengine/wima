import { Vector2 } from '../../math/index.js'
import { PhysicsProperties, Collider2D } from '../../physics/components/index.js'


/**
 * @param {PhysicsProperties} propA
 * @param {PhysicsProperties} propB
 */
export function canCollide(
  propA,
  propB
) {
  if (
    !propA.invmass &&
    !propB.invmass
  ) return false
  if (
    !(propA.group & propB.mask) ||
    !(propB.group & propA.mask)
  ) return false
  if (
    propA.sleep &&
    propB.sleep
  ) return false

  return true
}

/**
 * @param { Vector2} position
 * @param {number} radius
 * @param { Vector2} point
 */
export function circleContains(position, radius, point) {
  const dx = point.x - position.x,
    dy = point.y - position.y

  if (dx * dx + dy * dy > radius * radius) return false

  return true
}

/**
 * @param { Vector2[]} vertices
 * @param {Vector2} point
 */
export function verticesContain(vertices, point) {
  const pointX = point.x,
    pointY = point.y,
    { length } = vertices
  let previous = vertices[length - 1],
    current

  if (length < 2) return false

  for (let i = 0; i < length; i++) {
    current = vertices[i]

    if ((pointX - previous.x) * (current.y - previous.y) +
      (pointY - previous.y) * (previous.x - current.x) < 0) {
      return false
    }

    previous = current
  }

  return true
}

/**
 * @param {Collider2D} shape
 * @param { Vector2} point
 */
export function shapeContains(shape, point) {
  if (shape.type === Collider2D.Circle) return circleContains(shape.vertices[0], shape.vertices[1].x, point)

  return verticesContain(shape.vertices, point)
}

/**
 * @param {number} idA
 * @param {number} idB
 */
export function generatePairID(idA, idB) {
  return idA > idB ? `${idA} ${idB}` : `${idB} ${idA}`
}