import { Query, World } from '../../ecs/index.js'
import { Vector2, Vector3 } from '../../math/index.js'
import { Acceleration2D } from '../../movable/index.js'
import { PhysicsProperties } from '../../physics/index.js'

/**
 * @param {World} world
 */
export function applyGravity2D(world) {
  const gravity = world.getResource('gravity2d')
  const query = new Query(world, [Acceleration2D, PhysicsProperties])

  query.each(([acceleration, properties]) => {
    if (properties.invmass === 0) return

    Vector2.add(
      acceleration,
      gravity,
      acceleration
    )
  })
}

/**
 * @param {World} world
 */
export function applyGravity3D(world) {
  const gravity = world.getResource('gravity3d')
  const query = new Query(world, ['acceleration3d', 'physicsproperties'])

  query.each(([acceleration, properties]) => {
    if (properties.invmass === 0) return

    Vector3.add(
      acceleration,
      gravity,
      acceleration
    )
  })
}