/** @import { Defaultable } from '../../utils/index.js' */
/** @import { HandleProvider } from '../core/index.js' */

import { App } from '../../app/index.js'
import { Assets } from '../core/index.js'
import { AssetLoadFail, AssetLoadSuccess } from '../events/index.js'
import { AssetBasePath } from '../resources/index.js'


/**
 * @template T
 */

export class AssetPlugin {

  /**
   * @readonly
   * @type {string}
   */
  path

  /**
   * @readonly
   * @type {Defaultable<T> & (new (...args:any)=>T)}
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
    const name = this.asset.name.toLowerCase()
    const world = app.getWorld()


    // TODO - Separate the events to become for each
    // asset type
    app
      .registerEvent(AssetLoadSuccess)
      .registerEvent(AssetLoadFail)
    world.setResourceByName(`assetbasepath<${name}>`, new AssetBasePath(path))
    world.setResourceByName(`assets<${name}>`, new Assets(asset.default, handleprovider))
  }
}

/**
 * @template T
 * @typedef AssetPluginOptions
 * @property {string} [path]
 * @property {Defaultable<T> & (new (...args:any)=>T)} asset
 * @property {HandleProvider<T>} [handleprovider]
 */