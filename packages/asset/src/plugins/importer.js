/** @import {Constructor} from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { Importer } from '../core'
import { registerAssetImporterOnAssetServer } from '../systems'
import { AssetServerPlugin } from './assetServer'

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

  requires() {
    return [typeid(CorePlugin), typeid(AssetServerPlugin)]
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
