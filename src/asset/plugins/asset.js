/** @import { Constructor } from '../../reflect/index.js' */
/** @import { HandleProvider } from '../core/index.js' */

import { App, Plugin } from '../../app/index.js'
import { EventPlugin } from '../../event/plugin.js'
import { typeidGeneric } from '../../reflect/index.js'
import { Assets } from '../core/index.js'
import { AssetLoadFail, AssetLoadSuccess } from '../events/index.js'
import { AssetBasePath } from '../resources/index.js'


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
   * @type {HandleProvider<T> | undefined}
   */
  handleprovider

  /**
   * @param {AssetPluginOptions<T>} options
   */
  constructor(options) {
    super()
    const { path = '', asset, handleprovider } = options

    this.handleprovider = handleprovider
    this.path = path
    this.asset = asset
  }

  /**
   * @param {App} app
   */
  register(app) {
    const { asset, handleprovider, path } = this
    const world = app.getWorld()


    // TODO - Separate the events to become for each
    // asset type
    app
      .registerPlugin(new EventPlugin({
        event:AssetLoadSuccess
      }))
      .registerPlugin(new EventPlugin({
        event:AssetLoadFail
      }))
    world.setResourceByTypeId(
      typeidGeneric(AssetBasePath, [asset]),
      new AssetBasePath(path)
    )
    world.setResourceByTypeId(
      typeidGeneric(Assets, [asset]),
      new Assets(asset, handleprovider)
    )
  }

  name(){
    return typeidGeneric(AssetPlugin, [this.asset])
  }
}

/**
 * @template T
 * @typedef AssetPluginOptions
 * @property {string} [path]
 * @property {Constructor<T>} asset
 * @property {HandleProvider<T>} [handleprovider]
 */