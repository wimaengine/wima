import { Query, World } from '../../ecs/index.js'
import { Collider2D } from '../components/index.js'
import { Orientation2D, Position2D, Scale2D } from '../../transform/index.js'

/**
 * @param {World} world
 */
export function updateBodies(world) {

  /** @type {Query<[Position2D,Orientation2D,Scale2D,Collider2D]>} */
  const query = new Query(world, ['position2d', 'orientation2d', 'scale2d', 'collider2d'])

  query.each(([position, orientation, scale, shape]) => {
    Collider2D.update(
      shape,
      position,
      orientation.value,
      scale
    )
  })
}