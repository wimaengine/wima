/** @import {Constructor} from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems } from '@wimaengine/core'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { Exporter } from '../core'
import { registerAssetExporterOnAssetServer } from '../systems'

/**
 * @template T
 */
export class AssetExporterPlugin extends Plugin {

  /**
   * @readonly
   * @type {Constructor<T>}
   */
  asset

  /**
   * @readonly
   * @type {Exporter<T>}
   */
  exporter

  /**
   * @param {AssetExporterPluginOptions<T>} options
   */
  constructor(options) {
    super()
    const { asset, exporter } = options

    this.asset = asset
    this.exporter = exporter
  }

  /**
   * @param {App} app
   */
  register(app) {
    const { asset, exporter } = this

    app
      .registerSystem({
        label: `registerAssetExporterOnAssetServer<${typeid(asset)}>`,
        schedule: AppSchedule.Startup,
        systemGroup: CoreSystems.Start,
        system: registerAssetExporterOnAssetServer(asset, exporter)
      })
  }

  name() {
    return typeidGeneric(AssetExporterPlugin, [this.asset])
  }
}

/**
 * @template T
 * @typedef AssetExporterPluginOptions
 * @property {Constructor<T>} asset
 * @property {Exporter<T>} exporter
 */
