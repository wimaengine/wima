import { App } from '../../app/index.js'
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
   * @param {AssetPluginOptions} options 
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
 * @typedef AssetPluginOptions
 * @property {string} [path]
 */