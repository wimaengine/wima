import { Query, World } from '../../ecs/index.js'
import { Vector2, Vector3 } from '../../math/index.js'
import { Rotation2D, Rotation3D, Velocity2D, Velocity3D } from '../../movable/index.js'
import { Angular2DDamping, Angular3DDamping } from '../resources/angulardampen.js'
import { Linear2DDamping, Linear3DDamping } from '../resources/lineardampen.js'

/**
 * @param {World} world
 */
export function dampenVelocity2D(world) {
  const query = new Query(world, [Velocity2D])

  const linear = 1 - world.getResource(Linear2DDamping).value
  
  query.each(([velocity]) => {
    Vector2.multiplyScalar(velocity, linear, velocity)
  })
}

/**
 * @param {World} world
 */
export function dampenVelocity3D(world) {
  const query = new Query(world, [Velocity3D])
  const linear = 1 - world.getResource(Linear3DDamping).value
  
  query.each(([velocity]) => {
    Vector3.multiplyScalar(velocity, linear, velocity)
  })
}

/**
 * @param {World} world
 */
export function dampenRotation2D(world) {
  const query = new Query(world, [Rotation2D])
  const angular = 1 - world.getResource(Angular2DDamping).value
  
  query.each(([rotation]) => {
    rotation.value *= angular
  })
}

/**
 * @param {World} world
 */
export function dampenRotation3D(world) {

  const query = new Query(world, [Rotation3D])
  const angular = 1 - world.getResource(Angular3DDamping).value
  
  query.each(([rotation]) => {
    rotation.w *= angular
    rotation.x *= angular
    rotation.y *= angular
    rotation.z *= angular
  })
}