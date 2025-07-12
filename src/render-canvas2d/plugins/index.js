/** @import { Constructor } from '../../reflect/index.js' */
/** @import { Canvas2DFunction } from '../types/index.js' */

import { App, AppSchedule, Plugin } from '../../app/index.js'
import { typeidGeneric } from '../../reflect/index.js'
import { genrender } from '../systems/index.js'
import { Material } from '../../render-core/index.js'

/**
 * @template {Material} T
 */
export class Canvas2DMaterialPlugin extends Plugin {

  /**
   * @readonly
   * @type {Canvas2DFunction<T>}
   */
  update

  /**
   * @readonly
   * @type {Constructor<T>}
   */
  material

  /**
   * @param {Canvas2DMaterialPluginOptions<T>} options 
   */
  constructor({ update, material }) {
    super()
    this.update = update
    this.material = material
  }

  /**
   * @param {App} app
   */
  register(app) {
    const { material, update } = this

    app.registerSystem(AppSchedule.Update, genrender(material, update))
  }

  name() {
    return typeidGeneric(Canvas2DMaterialPlugin, [this.material])
  }
}

/**
 * @template {Material} T
 * @typedef Canvas2DMaterialPluginOptions
 * @property {Canvas2DFunction<T>} update
 * @property {Constructor<T>} material
 */