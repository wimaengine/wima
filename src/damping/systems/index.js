import { Query, World } from '../../ecs/index.js'
import { Vector2, Vector3 } from '../../math/index.js'
import { Rotation2D, Rotation3D, Velocity2D, Velocity3D } from '../../movable/index.js'

/**
 * @param {World} world
 */
export function dampenVelocity2D(world) {
  const query = new Query(world, [Velocity2D])

  const linear = 1 - world.getResource('lineardamping')
  
  query.each(([velocity]) => {
    Vector2.multiplyScalar(velocity, linear, velocity)
  })
}

/**
 * @param {World} world
 */
export function dampenVelocity3D(world) {
  const query = new Query(world, [Velocity3D])
  const linear = 1 - world.getResource('lineardamping')
  
  query.each(([velocity]) => {
    Vector3.multiplyScalar(velocity, linear, velocity)
  })
}

/**
 * @param {World} world
 */
export function dampenRotation2D(world) {

  /** @type {Query<[Rotation2D]>} */
  const query = new Query(world, ['rotation2d'])
  const angular = 1 - world.getResource('angulardamping')
  
  query.each(([rotation]) => {
    rotation.value *= angular
  })
}

/**
 * @param {World} world
 */
export function dampenRotation3D(world) {

  /** @type {Query<[Rotation3D]>} */
  const query = new Query(world, ['rotation3d'])
  const angular = 1 - world.getResource('angulardamping')
  
  query.each(([rotation]) => {
    rotation.w *= angular
    rotation.x *= angular
    rotation.y *= angular
    rotation.z *= angular
  })
}