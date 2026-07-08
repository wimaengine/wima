import { Query, World } from '@wimaengine/ecs'
import { Vector2, Vector3 } from '@wimaengine/math'
import { Acceleration2D, Acceleration3D } from '@wimaengine/movable'
import { PhysicsProperties } from '@wimaengine/narrowphase'
import { Gravity2D, Gravity3D } from '../resources/gravity'

/**
 * @param {World} world
 */
export function applyGravity2D(world) {
  const gravity = world.getResource(Gravity2D)
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
  const gravity = world.getResource(Gravity3D)
  const query = new Query(world, [Acceleration3D, PhysicsProperties])

  query.each(([acceleration, properties]) => {
    if (properties.invmass === 0) return

    Vector3.add(
      acceleration,
      gravity,
      acceleration
    )
  })
}

export * from './types'
