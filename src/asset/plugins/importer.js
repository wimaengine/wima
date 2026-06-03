/** @import {Constructor} from '../../type/index.js' */
import { App, Plugin } from '../../app/index.js'
import { AppSchedule, CoreSystems } from '../../core/index.js'
import { typeid, typeidGeneric } from '../../type/index.js'
import { Importer } from '../core/index.js'
import { registerAssetImporterOnAssetServer } from '../systems/index.js'

/**
 * @template T
 */

export class AssetImporterPlugin extends Plugin {

  /**
   * @readonly
   * @type {Constructor<T>}
   */
  asset

  /**
   * @readonly
   * @type {Importer<T>}
   */
  importer

  /**
   * @param {AssetImporterPluginOptions<T>} options
   */
  constructor(options) {
    super()
    const { asset, importer } = options

    this.asset = asset
    this.importer = importer
  }

  /**
   * @param {App} app
   */
  register(app) {
    const { asset, importer } = this

    app
      .registerSystem({
        label: `registerAssetImporterOnAssetServer<${typeid(asset)}>`,
        schedule: AppSchedule.Startup,
        systemGroup: CoreSystems.Start,
        system: registerAssetImporterOnAssetServer(asset, importer)
      })
  }

  name() {
    return typeidGeneric(AssetImporterPlugin, [this.asset])
  }
}

/**
 * @template T
 * @typedef AssetImporterPluginOptions
 * @property {Constructor<T>} asset
 * @property {Importer<T>} importer
 */
