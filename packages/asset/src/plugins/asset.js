/** @import { Constructor } from '@wimaengine/type' */

import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems } from '@wimaengine/core'
import { EventPlugin } from '@wimaengine/event'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { Assets } from '../resources'
import { registerAssetTypes, registerAssetOnAssetServer, unloadDroppedAssets, updateAssetChannel, updateAssetEvents } from '../systems'

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
   * @type {import('../systems').AssetEvents<T>}
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

    app.registerSystem({
      label: `updateAssetChannel<${typeid(asset)}>`,
      schedule: AppSchedule.Update,
      systemGroup: CoreSystems.End,
      system: updateAssetChannel(asset)
    })
    .registerSystem({
      label: `registerAssetOnAssetServer<${typeid(asset)}>`,
      schedule: AppSchedule.Startup,
      systemGroup: CoreSystems.Start,
      system: registerAssetOnAssetServer(asset)
    })
    .registerSystem({
      label: `registerAssetTypes<${typeid(asset)}>`,
      schedule: AppSchedule.Startup,
      systemGroup: CoreSystems.Start,
      system: registerAssetTypes(asset)
    })
    .setResourceByTypeId(
      typeidGeneric(Assets, [asset]),
      new Assets(asset)
    )
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
 * @property {import('../systems').AssetEvents<T>} [events]
 */
