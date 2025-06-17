/** @import { Constructor, TypeId } from '../../reflect/index.js' */

import { App, AppSchedule, Plugin } from '../../app/index.js'
import { typeidGeneric } from '../../reflect/index.js'
import { Material } from '../assets/index.js'
import { Material2D, Material3D } from '../components/index.js'
import { genBinRenderables2D, genBinRenderables3D } from '../systems/index.js'

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
      .registerSystem(AppSchedule.Update, genBinRenderables2D(asset, component))
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
      .registerSystem(AppSchedule.Update, genBinRenderables3D(asset, component))
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