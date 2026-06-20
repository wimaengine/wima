/** @import { Constructor, TypeId } from '../../type/index.js' */
import { App, Plugin } from '../../app/index.js'
import { AppSchedule, CoreSystems } from '../../core/index.js'
import { ComponentHooks } from '../../ecs/index.js'
import { typeid, typeidGeneric } from '../../type/index.js'
import { Material } from '../assets/index.js'
import { dropMaterialInstance, MaterialInstance } from '../components/index.js'
import { genBinRenderables2D, genBinRenderables3D, registerMaterialTypes } from '../systems/index.js'

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
      .registerType(component)
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
