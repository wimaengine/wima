/** @import { Constructor } from '@wimaengine/type' */
/** @import { Canvas2DFunction } from '../types' */

import { App, Plugin } from '@wimaengine/app'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { genrender } from '../systems'
import { Material } from '@wimaengine/render-core'
import { AppSchedule, CoreSystems } from '@wimaengine/core'

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

    app.registerSystem({
      schedule: AppSchedule.Update,
      label: `renderToCanvas2d<${typeid(material)}>`,
      systemGroup: CoreSystems.PostMain,
      system: genrender(material, update)
    })
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
