import { App, AppSchedule } from '../../app/index.js'
import { Parser } from '../core/index.js'
import { generateParserSystem } from '../systems/index.js'


/**
 * @template T
 */

export class AssetParserPlugin {

  /**
   * @readonly
   * @type {new (...args:any)=>T}
   */
  asset

  /**
   * @readonly
   * @type {Parser<T>}
   */
  parser

  /**
   * @param {AssetParserPluginOptions<T>} options 
   */
  constructor(options) {
    const { asset, parser } = options

    this.asset = asset
    this.parser = parser
  }

  /**
   * @param {App} app
   */
  register(app) {
    const { asset, parser } = this
    const name = asset.name.toLowerCase()

    app
      .registerSystem(AppSchedule.Update, generateParserSystem(name))
      .getWorld()
      .setResourceByName(`parser<${name}>`, parser)
  }
}

/**
 * @template T
 * @typedef AssetParserPluginOptions
 * @property {new ()=>T} asset
 * @property {Parser<T>} parser
 */