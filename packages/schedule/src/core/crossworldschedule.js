/** @import { CrossWorldSystemFunc } from './crossworldsystem' */
/** @import { SystemId } from '@wimaengine/ecs' */
/** @import { World } from '@wimaengine/ecs' */

import { Bitset } from '@wimaengine/datastructures'
import { World as EcsWorld } from '@wimaengine/ecs'

/**
 * Stores a collection of crossworld systems which are in order.
 *
 * Crossworld systems receive both the target world and the source world.
 */
export class CrossWorldSchedule {

  /**
   * @private
   * @type {CrossWorldSystemFunc[]}
   */
  systems = []

  /**
   * @private
   * @type {Bitset}
   */
  condition = new Bitset()

  /**
   * @param {CrossWorldSystemFunc} system
   * @returns {SystemId}
   */
  add(system) {
    const { length } = this.systems

    this.systems.push(system)
    this.condition.resize(length + 1)
    this.condition.set(length)

    return length
  }

  /**
   * @param {World} targetWorld
   * @param {World} sourceWorld
   * @param {(error: Error, world: EcsWorld) => void} [errorHandler]
   */
  run(targetWorld, sourceWorld, errorHandler) {
    const handler = errorHandler ?? defaultErrorHandler

    for (let i = 0; i < this.systems.length; i++) {
      try {
        if (this.condition.get(i)) this.systems[i](targetWorld, sourceWorld)
      } catch(error) {
        if (error instanceof Error) {
          handler(error, targetWorld)
        } else if (typeof error === 'string') {
          handler(new Error(error), targetWorld)
        } else {
          handler(new Error(String(error)), targetWorld)
        }
      }
    }
  }
}

/**
 * @param {Error} error
 * @throws {Error}
 */
function defaultErrorHandler(error) {
  throw error
}
