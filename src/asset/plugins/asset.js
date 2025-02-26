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

   */
  constructor({ path = '' } = {}){
    this.path = path
  }

  /**
   * @param {App} app
   */
  register(app) {
    app
      .registerEvent(AssetLoadSuccess)
      .registerEvent(AssetLoadFail)
      .setResource(new AssetBasePath(this.path))
  }
}

/**
 * @template T
 * @typedef AssetPluginOptions
 * @property {string} [path]
 */