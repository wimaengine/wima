import { Query, World } from '../../ecs/index.js'
import { Vector2 } from '../../math/index.js'
import { Velocity2D } from '../../movable/index.js'

/**
 * @param {World} world
 */
export function dampenVelocity2D(world) {

  /** @type {Query<[Velocity2D]>} */
  const query = new Query(world, ['velocity2d'])

  const linear = 1 - world.getResource('lineardamping')
  
  query.each(([velocity]) => {
    Vector2.multiplyScalar(velocity, linear, velocity)
  })
}