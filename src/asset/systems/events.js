/** @import { SystemFunc, World } from '../../ecs/index.js' */
/** @import { Constructor } from '../../reflect/index.js' */
/** @import { AssetEvents } from '../index.js' */
import { Assets } from '../core/index.js'
import { Events } from '../../event/index.js'
import { typeid, typeidGeneric } from '../../reflect/index.js'
import { AssetServer } from '../resources/index.js'
import { AssetAdded, AssetDropped, AssetModified, AssetLoadSuccess, AssetLoadFail } from '../events/index.js'
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
  const modifiedEventsId = typeidGeneric(Events, [eventType.modified])
  const droppedEventsId = typeidGeneric(Events, [eventType.dropped])

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

/**
 * @template T
 * @param {World} world
 * @returns {void}
 */
export function updateAssetLoadEvents(world) {
  const server = world.getResource(AssetServer)

  /** @type {Events<AssetLoadSuccess>} */
  const sucessEvents = world.getResourceByTypeId(typeidGeneric(Events, [AssetLoadSuccess]))

  /** @type {Events<AssetLoadFail>} */
  const failEvents = world.getResourceByTypeId(typeidGeneric(Events, [AssetLoadFail]))

  const succeeded = server.flushLoadSuccess()
  const failed = server.flushLoadFail()

  for (let i = 0; i < succeeded.length; i++) {
    sucessEvents.write(succeeded[i])
  }

  for (let i = 0; i < failed.length; i++) {
    failEvents.write(failed[i])
  }
}
