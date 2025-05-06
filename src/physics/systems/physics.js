import { PhysicsHitbox } from '../../broadphase/index.js'
import { Query, World } from '../../ecs/index.js'
import { CollisionManifold } from '../../narrowphase/index.js'
import { PhysicsSettings } from '../settings.js'
import { Collider2D } from '../components/index.js'
import { Orientation2D, Position2D, Scale2D } from '../../transform/index.js'

/**
 * @param {World} world
 */
export function updateBodies(world) {
  const query = new Query(world, [Position2D, Orientation2D, Scale2D, Collider2D])

  query.each(([position, orientation, scale, shape]) => {
    Collider2D.update(
      shape,
      position,
      orientation.value,
      scale
    )
  })
}

/**
 * @param {World} world
 */
export function updateBounds(world) {

  const query = new Query(world, [Collider2D, PhysicsHitbox])

  query.each(([shape, bound]) => {
    let minX = Number.MAX_SAFE_INTEGER,
      minY = Number.MAX_SAFE_INTEGER,
      maxX = -Number.MAX_SAFE_INTEGER,
      maxY = -Number.MAX_SAFE_INTEGER

    if (shape.type === Collider2D.Circle) {
      const position = shape.vertices[0]
      const radiusX = shape.vertices[1].x
      const radiusY = shape.vertices[1].y
      const idx = position.x - radiusX,
        idy = position.y - radiusY,
        mdx = position.x + radiusX,
        mdy = position.y + radiusY

      if (idx < minX) minX = idx
      if (mdx > maxX) maxX = mdx
      if (idy < minY) minY = idy
      if (mdy > maxY) maxY = mdy
    } else {
      for (let j = 0; j < shape.vertices.length; j++) {
        const vertex = shape.vertices[j]

        if (vertex.x < minX) minX = vertex.x
        if (vertex.x > maxX) maxX = vertex.x
        if (vertex.y < minY) minY = vertex.y
        if (vertex.y > maxY) maxY = vertex.y
      }
    }

    bound.min.x = minX
    bound.max.x = maxX
    bound.min.y = minY
    bound.max.y = maxY
  })
}

/**
 * @param {World} world
 */
export function collisionResponse(world) {
  const invDt = 60
  const contacts = world.getResource('contacts')

  for (let i = 0; i < contacts.length; i++) {
    const {
      positionA,
      positionB,
      velocityA,
      velocityB,
      rotationA,
      rotationB
    } = contacts[i]

    CollisionManifold.prepare(
      contacts[i],
      positionA,
      positionB,
      velocityA,
      velocityB,
      rotationA,
      rotationB,
      invDt
    )
  }

  for (let i = 0; i < PhysicsSettings.velocitySolverIterations; i++) {
    for (let j = 0; j < contacts.length; j++) {
      CollisionManifold.solve(
        contacts[j]
      )
    }
  }
}