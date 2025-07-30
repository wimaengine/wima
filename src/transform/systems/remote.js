import { Query, World } from '../../ecs/index.js'
import { Rotary } from '../../math/index.js'
import { Position2D, Orientation2D, Scale2D, Position3D, Orientation3D, Scale3D, RemoteTransform2D, RemoteTransform3D } from '../components/index.js'


/**
 * @param {World} world
 */
export function transformRemote2D(world) {
  const transforms = new Query(world, [Position2D, Orientation2D, Scale2D])
  const remotes = new Query(world, [Position2D, Orientation2D, Scale2D, RemoteTransform2D])

  remotes.each(([position, orientation, scale, remote]) => {
    const entity = transforms.get(remote.entity)
    const [offPosition, offOrientation, offScale] = remote.offsetTransform.decompose()

    if (!entity) return

    if (remote.copyTranslation) {
      position.copy(entity[0]).add(offPosition)
    }
    if (remote.copyOrientation) {
      orientation.value = entity[1].value + Rotary.toAngle(offOrientation)
    }
    if (remote.copyScale) {
      scale.copy(entity[2]).multiply(offScale)
    }
  })
}

/**
 * @param {World} world
 */
export function transformRemote3D(world) {
  const transforms = new Query(world, [Position3D, Orientation3D, Scale3D])
  const remotes = new Query(world, [Position3D, Orientation3D, Scale3D, RemoteTransform3D])

  remotes.each(([position, orientation, scale, remote]) => {
    const [offPosition, offOrientation, offScale] = remote.offsetTransform.decompose()

    const entity = transforms.get(remote.entity)

    if (!entity) return

    if (remote.copyTranslation) {
      position.copy(entity[0]).add(offPosition)
    }
    if (remote.copyOrientation) {
      orientation.copy(entity[1]).multiply(offOrientation)
    }
    if (remote.copyScale) {
      scale.copy(entity[2]).multiply(offScale)
    }
  })
}