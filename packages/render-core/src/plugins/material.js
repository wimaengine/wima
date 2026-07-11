/** @import { Constructor, TypeId } from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { Material } from '../assets'
import { dropMaterialInstance, MaterialInstance } from '../components'
import { genBinRenderables2D, genBinRenderables3D, registerMaterialTypes } from '../systems'

/**
 * @template {Material} T
 */
export class MaterialInstancePlugin extends Plugin {

  /**
   * @readonly
   * @type {Constructor<MaterialInstance<T>>}
   */
  component

  /**
   * @readonly
   * @type {Constructor<T>}
   */
  asset

  /**
   * @param {MaterialPluginOptions<T>} param0
   */
  constructor({ component, asset }) {
    super()
    this.asset = asset
    this.component = component
  }

  /**
   * @param {App} app
   */
  register(app) {
    const { asset, component } = this

    app
      .setComponentHooks(component, new ComponentHooks(
        null,
        dropMaterialInstance(component)
      ))
      .registerSystem({
        schedule: AppSchedule.Startup,
        systemGroup: CoreSystems.Start,
        label: `registerMaterialTypes<${typeid(asset)}>`,
        system: registerMaterialTypes(component, asset)
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: CoreSystems.PostMain,
        label: `binRenders2D<${typeid(asset)}>`,
        system: genBinRenderables2D(asset, component)
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: CoreSystems.PostMain,
        label: `binRenders3D<${typeid(asset)}>`,
        system: genBinRenderables3D(asset, component)
      })
  }

  /**
   * @returns {TypeId}
   */
  name() {
    return typeidGeneric(MaterialInstancePlugin, [this.asset])
  }
}

/**
 * @template {Material} T
 * @typedef MaterialPluginOptions
 * @property {Constructor<MaterialInstance<T>>} component
 * @property {Constructor<T>} asset
 */
