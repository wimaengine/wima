import { Query, World } from '../../ecs/index.js'
import { Vector2 } from '../../math/index.js'

/**
 * @param {World} world
 */
export function applyGravity2D(world) {
  const gravity = world.getResource('gravity2d')
  const query = new Query(world, ['acceleration2d', 'physicsproperties'])

  query.each(([acceleration, properties]) => {
    if (properties.invmass === 0) return

    Vector2.add(
      acceleration,
      gravity,
      acceleration
    )
  })
}