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