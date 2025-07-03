import { Query, World } from '../../ecs/index.js'
import { Position2D, Orientation2D, Scale2D, GlobalTransform2D, Position3D, Orientation3D, Scale3D, GlobalTransform3D } from '../components/index.js'

/**
 * @param {World} world
 */
export function synctransform2D(world) {
  const query = new Query(world, [Position2D, Orientation2D, Scale2D, GlobalTransform2D])

  query.each(([position, orientation, scale, transform]) => {
    transform.compose(position, orientation, scale)
  })
}

/**
 * @param {World} world
 */
export function synctransform3D(world) {
  const query = new Query(world, [Position3D, Orientation3D, Scale3D, GlobalTransform3D])

  query.each(([position, orientation, scale, transform]) => {
    transform.compose(position, orientation, scale)
  })
}