import { Query, World } from '../../ecs/index.js'
import { Vector2 } from '../../math/index.js'

/**
 * @param {World} world
 */
export function updatePositionVerlet2D(world) {
  const query = new Query(world, ['position2d', 'velocity2d', 'acceleration2d'])
  const dt = 1 / 60

  query.each(([position, velocity, acceleration]) => {
    Vector2.multiplyScalar(acceleration, dt * 0.5, acceleration)
    Vector2.add(velocity, acceleration, velocity)
    Vector2.set(
      position,
      position.x + velocity.x * dt + acceleration.x * dt,
      position.y + velocity.y * dt + acceleration.y * dt
    )
    Vector2.add(velocity, acceleration, velocity)
    Vector2.set(acceleration, 0, 0)
  })
}