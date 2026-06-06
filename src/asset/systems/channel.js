/** @import { SystemFunc } from '../../ecs/index.js' */
/** @import { Constructor } from '../../type/index.js' */

import { typeidGeneric } from '../../type/index.js'
import { Assets } from '../core/index.js'

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
