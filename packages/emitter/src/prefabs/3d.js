/** @import {EmitterOptions} from "../components" */
import { Children } from '@wimaengine/hierarchy'
import { Vector3 } from '@wimaengine/math'
import { Timer } from '@wimaengine/time'
import { createTransform3D, GlobalTransform3D, Orientation3D, Position3D, Scale3D } from '@wimaengine/transform'
import { Emitter } from '../components'

/**
 * @param {EmitterOptions} [prefab]
 * @param {Vector3} [position]
 * @param {Vector3} [angle]
 * @returns {[Position3D, Orientation3D, Scale3D, GlobalTransform3D, Emitter, Timer,Children]}
 */
export function createEmitter3D(prefab, position, angle) {
  return [
    ...createTransform3D(
      position?.x,
      position?.y,
      position?.z,
      angle?.x,
      angle?.y,
      angle?.z
    ),
    new Emitter(prefab),
    new Timer(),
    new Children()
  ]
}
