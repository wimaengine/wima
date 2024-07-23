import { Query, World } from '../../ecs/index.js'
import { Vector2 } from '../../math/index.js'

/**
 * @param {World} world
 */
export function updateVelocityEuler2D(world) {
  const query = new Query(world, ['velocity2d', 'acceleration2d'])
  const dt = 1 / 60

  query.each(([velocity, acceleration]) => {    
    Vector2.set(
      velocity,
      velocity.x + acceleration.x * dt,
      velocity.y + acceleration.y * dt
    )
    Vector2.set(acceleration, 0, 0)
  })
}

/**
 * @param {World} world
 */
export function updateAngularEuler2D(world) {
  const query = new Query(world, ['rotation2d', 'torque2d'])
  const dt = 1 / 60

  query.each(([rotation, torque]) => {  
    rotation.value += torque.value * dt
    torque.value = 0
  })
}

/**
 * @param {World} world
 */
export function updatePositionEuler2D(world) {
  const query = new Query(world, ['position2d', 'velocity2d'])
  const dt = 1 / 60

  query.each(([position, velocity]) => {
    Vector2.set(
      position,
      position.x + velocity.x * dt,
      position.y + velocity.y * dt
    )
  })
}