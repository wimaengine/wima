/** @import { Constructor } from '@wimaengine/type' */
/** @import { Canvas2DFunction } from '../types' */

import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { Material } from '@wimaengine/render-core'
import { RenderCorePlugin } from '@wimaengine/render-core'
import { WindowPlugin } from '@wimaengine/window'
import { Transform2DPlugin } from '@wimaengine/transform'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { Canvas2DRendererPlugin } from '../plugin'
import { genrender } from '../systems'

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

  requires() {
    return [
      typeid(CorePlugin),
      typeid(Canvas2DRendererPlugin),
      typeid(RenderCorePlugin),
      typeid(Transform2DPlugin),
      typeid(WindowPlugin)
    ]
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
