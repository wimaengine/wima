/** @import {EmitterOptions} from "../components/index.js" */
import { Emitter } from '../components/index.js'
import { createTransform3D, GlobalTransform3D, Orientation3D, Position3D, Scale3D } from '../../transform/index.js'
import { Vector3 } from '../../math/index.js'
import { Children } from '../../hierarchy/index.js'
import { Timer } from '../../time/index.js'

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
