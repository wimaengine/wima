/** @import { SystemFunc } from '@wimaengine/ecs' */
/** @import { Constructor } from '@wimaengine/type' */

import { typeidGeneric } from '@wimaengine/type'
import { Assets } from '../resources'

/**
 * Drain the queued handle lifecycle messages for a single asset pool.
 *
 * @template T
 * @param {Constructor<T>} asset
 * @returns {SystemFunc}
 */
export function updateAssetChannel(asset) {
  const assetsId = typeidGeneric(Assets, [asset])

  return function updateAssetChannel(world) {

    /** @type {Assets<T>} */
    const assets = world.getResourceByTypeId(assetsId)

    assets.update()
  }
}
