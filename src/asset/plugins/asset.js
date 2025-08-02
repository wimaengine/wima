/** @import { Constructor } from '../../reflect/index.js' */
/** @import { HandleProvider } from '../core/index.js' */

import { App, AppSchedule, Plugin } from '../../app/index.js'
import { EventPlugin } from '../../event/plugin.js'
import { typeidGeneric } from '../../reflect/index.js'
import { Assets } from '../core/index.js'
import { AssetAdded, AssetDropped, AssetLoadFail, AssetLoadSuccess, AssetModified } from '../events/index.js'
import { AssetBasePath } from '../resources/index.js'
import { updateAssetEvents } from '../systems/index.js'


/**
 * @template T
 */

export class AssetPlugin extends Plugin {

  /**
   * @readonly
   * @type {string}
   */
  path

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
    const { path = '', asset, events } = options

    this.asset = asset
    this.events = events
    this.path = path
  }

  /**
   * @param {App} app
   */
  register(app) {
    const { asset, path, events } = this
    const world = app.getWorld()


    // TODO - Separate the events to become for each
    // asset type
    app
      .registerPlugin(new EventPlugin({
        event: AssetLoadSuccess
      }))
      .registerPlugin(new EventPlugin({
        event: AssetLoadFail
      }))

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
    }

    world.setResourceByTypeId(
      typeidGeneric(AssetBasePath, [asset]),
      new AssetBasePath(path)
    )
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