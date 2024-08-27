import { Query, World } from '../../ecs/index.js'
import { Vector2, Vector3 } from '../../math/index.js'
import { Velocity2D, Velocity3D } from '../../movable/index.js'

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

/**
 * @param {World} world
 */
export function dampenVelocity3D(world) {

  /** @type {Query<[Velocity3D]>} */
  const query = new Query(world, ['velocity3d'])

  const linear = 1 - world.getResource('lineardamping')
  
  query.each(([velocity]) => {
    Vector3.multiplyScalar(velocity, linear, velocity)
  })
}