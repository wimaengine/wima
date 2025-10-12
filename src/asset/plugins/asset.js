/** @import { Constructor } from '../../reflect/index.js' */

import { App, AppSchedule, Plugin } from '../../app/index.js'
import { EventPlugin } from '../../event/index.js'
import { typeidGeneric } from '../../reflect/index.js'
import { Assets } from '../core/index.js'
import { AssetAdded, AssetDropped, AssetModified } from '../events/index.js'
import { updateAssetEvents, registerAssetOnAssetServer, unloadDroppedAssets } from '../systems/index.js'

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
        .registerSystem(AppSchedule.Update, updateAssetEvents(asset, events))
        .registerSystem(AppSchedule.Update, unloadDroppedAssets(events.dropped))
    }

    app.registerSystem(AppSchedule.Startup, registerAssetOnAssetServer(asset))
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
