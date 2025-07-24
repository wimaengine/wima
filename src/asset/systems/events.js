/** @import { SystemFunc } from '../../ecs/index.js' */
/** @import { Constructor } from '../../reflect/index.js' */
/** @import { AssetEvents } from '../index.js' */
import { Assets } from '../core/index.js'
import { Events } from '../../event/index.js'
import { typeid, typeidGeneric } from '../../reflect/index.js'
import { AssetAdded, AssetDropped, AssetModified } from '../events/index.js'
import { warnOnce } from '../../logger/index.js'

/**
 * @template T
 * @param {Constructor<T>} assetType 
 * @param {AssetEvents<T>} eventType 
 * @returns {SystemFunc}
 */
export function updateAssetEvents(assetType, eventType) {
  const assetsId = typeidGeneric(Assets, [assetType])
  const addEventsId = typeidGeneric(Events, [eventType.added])
  const modifiedEventsId = typeidGeneric(Events, [eventType.added])
  const droppedEventsId = typeidGeneric(Events, [eventType.added])

  return function updateAssetEvents(world) {

    /** @type {Assets<T>} */
    const assets = world.getResourceByTypeId(assetsId)

    /** @type {Events<AssetAdded<T>>} */
    const addedEvents = world.getResourceByTypeId(addEventsId)

    /** @type {Events<AssetModified<T>>} */
    const modifiedEvents = world.getResourceByTypeId(modifiedEventsId)

    /** @type {Events<AssetDropped<T>>} */
    const droppedEvents = world.getResourceByTypeId(droppedEventsId)

    const events = assets.flushEvents()

    for (let i = 0; i < events.length; i++) {
      const event = events[i]

      if (event instanceof AssetAdded) {
        addedEvents.write(event)
      } else if (event instanceof AssetModified) {
        modifiedEvents.write(event)
      } else if (event instanceof AssetDropped) {
        droppedEvents.write(event)
      } else {
        const name = typeid(/** @type {Constructor}*/(event.constructor))

        warnOnce(`The asset event \`${name}\` is not handled!`)
      }
    }
  }
}