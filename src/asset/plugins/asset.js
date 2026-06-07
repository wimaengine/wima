/** @import { Constructor } from '../../type/index.js' */

import { App, Plugin } from '../../app/index.js'
import { AppSchedule, CoreSystems } from '../../core/index.js'
import { EventPlugin } from '../../event/index.js'
import { typeid, typeidGeneric } from '../../type/index.js'
import { Assets } from '../resources/index.js'
import { AssetAdded, AssetDropped, AssetModified } from '../events/index.js'
import { registerAssetTypes, registerAssetOnAssetServer, unloadDroppedAssets, updateAssetChannel, updateAssetEvents } from '../systems/index.js'

/**
 * @template T
 */

export class AssetPlugin extends Plugin {

  /**
   * @readonly
   * @type {Constructor<T>}
   */
  asset

  /**
   * @readonly
   * @type {AssetEvents<T>}
   */
  events

  /**
   * @param {AssetPluginOptions<T>} options
   */
  constructor(options) {
    super()
    const { asset, events } = options

    this.asset = asset
    this.events = events
  }

  /**
   * @param {App} app
   */
  register(app) {
    const { asset, events } = this
    const world = app.getWorld()

    app.registerSystem({
      label: `updateAssetChannel<${typeid(asset)}>`,
      schedule: AppSchedule.Update,
      systemGroup: CoreSystems.End,
      system: updateAssetChannel(asset)
    })

    if (events) {
      app
        .registerPlugin(new EventPlugin({
          event: events.added
        }))
        .registerPlugin(new EventPlugin({
          event: events.modified
        }))
        .registerPlugin(new EventPlugin({
          event: events.dropped
        }))
        .registerSystem({
          label: `updateAssetEvents<${typeid(asset)}>`,
          schedule: AppSchedule.Update,
          systemGroup: CoreSystems.End,
          system: updateAssetEvents(asset, events)
        })
        .registerSystem({
          label: `unloadDroppedAssets<${typeid(events.dropped)}>`,
          schedule: AppSchedule.Update,
          systemGroup: CoreSystems.End,
          system: unloadDroppedAssets(events.dropped)
        })
    }

    app.registerSystem({
      label: `registerAssetOnAssetServer<${typeid(asset)}>`,
      schedule: AppSchedule.Startup,
      systemGroup: CoreSystems.Start,
      system: registerAssetOnAssetServer(asset)
    })
    app.registerSystem({
      label: `registerAssetTypes<${typeid(asset)}>`,
      schedule: AppSchedule.Startup,
      systemGroup: CoreSystems.Start,
      system: registerAssetTypes(asset)
    })
    world.setResourceByTypeId(
      typeidGeneric(Assets, [asset]),
      new Assets(asset)
    )
  }

  name() {
    return typeidGeneric(AssetPlugin, [this.asset])
  }
}

/**
 * @template T
 * @typedef AssetPluginOptions
 * @property {string} [path]
 * @property {Constructor<T>} asset
 * @property {AssetEvents<T>} [events]
 */

/**
 * @template T
 * @typedef AssetEvents
 * @property {Constructor<AssetAdded<T>>} added
 * @property {Constructor<AssetModified<T>>} modified
 * @property {Constructor<AssetDropped<T>>} dropped
 */
