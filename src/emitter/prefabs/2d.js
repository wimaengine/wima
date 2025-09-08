/** @import {EmitterOptions} from "../components/index.js" */
import { Emitter } from '../components/index.js'
import { createTransform2D, GlobalTransform2D, Orientation2D, Position2D, Scale2D } from '../../transform/index.js'
import { Children } from '../../hierarchy/index.js'
import { Timer } from '../../time/index.js'


/**
 * @param {EmitterOptions} [prefab]
 * @param {number} [x]
 * @param {number} [y]
 * @param {number} [angle]
 * @returns {[Position2D, Orientation2D, Scale2D, GlobalTransform2D, Emitter, Timer,Children]}
 */
export function createEmitter2D(prefab, x, y, angle) {
  return [
    ...createTransform2D(x, y, angle),
    new Emitter(prefab),
    new Timer(),
    new Children()
  ]
}