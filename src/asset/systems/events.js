/** @import { SystemFunc, World } from '../../ecs/index.js' */
/** @import { Constructor } from '../../type/index.js' */
/** @import { AssetEvents } from '../index.js' */
import { Assets as ResourceAssets } from '../resources/index.js'
import { Events } from '../../event/index.js'
import { typeid, typeidGeneric } from '../../type/index.js'
import { AssetAdded, AssetDropped, AssetModified, AssetLoadFail, AssetLoadOperation } from '../events/index.js'
import { error, warnOnce } from '../../logger/index.js'

/**
 * @template T
 * @param {Constructor<T>} assetType
 * @param {AssetEvents<T>} eventType
 * @returns {SystemFunc}
 */
export function updateAssetEvents(assetType, eventType) {
  const assetsId = typeidGeneric(ResourceAssets, [assetType])
  const addEventsId = typeidGeneric(Events, [eventType.added])
  const modifiedEventsId = typeidGeneric(Events, [eventType.modified])
  const droppedEventsId = typeidGeneric(Events, [eventType.dropped])

  return function updateAssetEvents(world) {

    /** @type {ResourceAssets<T>} */
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
 * @param {World} world
 * @returns {void}
 */
export function logFailedLoads(world) {

  /** @type {Events<AssetLoadFail>} */
  const events = world.getResourceByTypeId(typeidGeneric(Events, [AssetLoadFail]))

  events.each((event) => {
    const { data } = event
    const operation = data.operation === AssetLoadOperation.Saving ? 'saving' : 'loading'

    error(`\`AssetServer\` error ${operation} "${data.path}": ${data.reason}`)
  })
}
