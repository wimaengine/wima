/** @import {Constructor} from '../../reflect/index.js' */
import { App, AppSchedule, Plugin } from '../../app/index.js'
import { typeidGeneric } from '../../reflect/index.js'
import { Parser } from '../core/index.js'
import { generateParserSystem } from '../systems/index.js'


/**
 * @template T
 */

export class AssetParserPlugin extends Plugin {

  /**
   * @readonly
   * @type {Constructor<T>}
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
    super()
    const { asset, parser } = options

    this.asset = asset
    this.parser = parser
  }

  /**
   * @param {App} app
   */
  register(app) {
    const { asset, parser } = this

    app
      .registerSystem(AppSchedule.Update, generateParserSystem(asset))
      .getWorld()
      .setResourceByTypeId(typeidGeneric(Parser, [asset]), parser)
  }

  name(){
    return typeidGeneric(AssetParserPlugin, [this.asset])
  }
}

/**
 * @template T
 * @typedef AssetParserPluginOptions
 * @property {Constructor<T>} asset
 * @property {Parser<T>} parser
 */