/** @import { Constructor, TypeId } from '@wimaengine/type' */

import { World } from '@wimaengine/ecs'
import { assert } from '@wimaengine/logger'
import { typeid } from '@wimaengine/type'

/**
 * A map of worlds keyed by `TypeId`, with default-world lookup.
 *
 * @augments {Map<TypeId, World>}
 */
export class Worlds extends Map {

  /**
   * @type {TypeId | undefined}
   */
  defaultWorldId = undefined

  /**
   * Return the default world or a world by label.
   *
   * @param {Constructor | undefined} [label]
   * @returns {World}
   */
  getWorld(label) {
    if (!label) {
      assert(this.defaultWorldId, 'The default world is not set.')
      const world = this.get(this.defaultWorldId)

      assert(world, `The world "${this.defaultWorldId}" is not set.`)

      return world
    }

    const worldId = typeid(label)
    const world = this.get(worldId)

    assert(world, `The world "${worldId}" is not set.`)

    return world
  }
}
