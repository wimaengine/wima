import { Query, World } from '../../ecs/index.js'
import { Vector2 } from '../../math/index.js'
import { Acceleration2D, Rotation2D, Torque2D, Velocity2D } from '../../movable/index.js'
import { Orientation2D, Position2D } from '../../transform/index.js'

/**
 * @param {World} world
 */
export function updatePositionVerlet2D(world) {
  const query = new Query(world, [Position2D, Velocity2D, Acceleration2D])
  const dt = 1 / 60

  query.each(([position, velocity, acceleration]) => {
    Vector2.multiplyScalar(acceleration, dt * 0.5, acceleration)
    Vector2.add(velocity, acceleration, velocity)
    Vector2.set(
      position.x + velocity.x * dt + acceleration.x * dt,
      position.y + velocity.y * dt + acceleration.y * dt,
      position
    )
    Vector2.add(velocity, acceleration, velocity)
    Vector2.set(0, 0, acceleration)
  })
}

/**
 * @param {World} world
 */
export function updateOrientationVerlet2D(world) {
  const query = new Query(world, [Orientation2D, Rotation2D, Torque2D])
  const dt = 1 / 60

  query.each(([orientation, rotation, torque]) => {
    torque.value *= dt * 0.5
    rotation.value += torque.value
    orientation.value += rotation.value * dt + torque.value * dt
    rotation.value += torque.value * dt * 0.5
    torque.value = 0
  })
}