/** @import { Constructor, TypeId } from '../../type/index.js' */
import { App, Plugin } from '../../app/index.js'
import { AppSchedule, CoreSystems } from '../../core/index.js'
import { ComponentHooks } from '../../ecs/index.js'
import { typeid, typeidGeneric } from '../../type/index.js'
import { Material } from '../assets/index.js'
import { dropMaterial2D, dropMaterial3D, Material2D, Material3D } from '../components/index.js'
import { genBinRenderables2D, genBinRenderables3D, registerMaterialTypes } from '../systems/index.js'

/**
 * @template {Material} T
 */
export class Material2DPlugin extends Plugin {

  /**
   * @readonly
   * @type {Constructor<Material2D<T>>}
   */
  component

  /**
   * @readonly
   * @type {Constructor<T>}
   */
  asset

  /**
   * @param {Material2DPluginOptions<T>} param0
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
        dropMaterial2D(component)
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
        label: `registerMaterialTypes<${typeid(asset)}>`,
        system: genBinRenderables2D(asset, component)
      })
  }

  /**
   * @returns {TypeId}
   */
  name() {
    return typeidGeneric(Material2DPlugin, [this.asset])
  }
}

/**
 * @template {Material} T
 */
export class Material3DPlugin extends Plugin {

  /**
   * @readonly
   * @type {Constructor<Material3D<T>>}
   */
  component

  /**
   * @readonly
   * @type {Constructor<T>}
   */
  asset

  /**
   * @param {Material3DPluginOptions<T>} param0
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
        dropMaterial3D(component)
      ))
      .registerSystem({
        schedule: AppSchedule.Startup,
        systemGroup: CoreSystems.Start,
        label: `initRenderPipeline<${typeid(asset)}>`,
        system: registerMaterialTypes(component, asset)
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
    return typeidGeneric(Material3DPlugin, [this.asset])
  }
}

/**
 * @template {Material} T
 * @typedef Material2DPluginOptions
 * @property {Constructor<Material2D<T>>} component
 * @property {Constructor<T>} asset
 */

/**
 * @template {Material} T
 * @typedef Material3DPluginOptions
 * @property {Constructor<Material3D<T>>} component
 * @property {Constructor<T>} asset
 */
