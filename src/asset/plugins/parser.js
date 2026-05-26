/** @import {Constructor} from '../../type/index.js' */
import { App, Plugin } from '../../app/index.js'
import { AppSchedule, CoreSystems } from '../../core/index.js'
import { typeid, typeidGeneric } from '../../type/index.js'
import { Parser } from '../core/index.js'
import { registerAssetParserOnAssetServer } from '../systems/index.js'

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
      .registerSystem({
        label: `registerAssetParserOnAssetServer<${typeid(asset)}>`,
        schedule: AppSchedule.Startup,
        systemGroup: CoreSystems.Start,
        system: registerAssetParserOnAssetServer(asset, parser)
      })
  }

  name() {
    return typeidGeneric(AssetParserPlugin, [this.asset])
  }
}

/**
 * @template T
 * @typedef AssetParserPluginOptions
 * @property {Constructor<T>} asset
 * @property {Parser<T>} parser
 */
