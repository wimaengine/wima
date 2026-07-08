/** @import {Constructor} from '@wimaengine/type' */
/** @import {UniformBind} from '@wimaengine/render-core' */

import { App } from '@wimaengine/app'
import { AppSchedule } from '@wimaengine/core'
import { CoreSystems } from '@wimaengine/core'
import { typeid, typeidGeneric } from '@wimaengine/type'
import { Material } from '@wimaengine/render-core'
import { genRegisterBuffer, genRender, genRenderPipeline } from '../systems'

/**
 * @template {Material & UniformBind} T
 */
export class WebglMaterialPlugin {

  /**
   * @readonly
   * @type {Constructor<T>}
   */
  material

  /**
   * @readonly
   * @type {string}
   */
  vertex3d

  /**
   * @readonly
   * @type {string}
   */
  fragment3d

  /**
   * @param {WebglMaterialPluginOptions<T>} options
   */
  constructor({
    fragment3d,
    vertex3d,
    material
  }) {
    this.vertex3d = vertex3d
    this.fragment3d = fragment3d
    this.material = material
  }

  /**
   * @param {App} app
   */
  register(app) {
    const { material, vertex3d, fragment3d } = this

    app
      .registerSystem({
        schedule: AppSchedule.Startup,
        systemGroup: CoreSystems.Start,
        label: `registerBuffers<${typeid(material)}>`,
        system: genRegisterBuffer(material)
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: CoreSystems.PostMain,
        label: `initRenderPipeline<${typeid(material)}>`,
        system: genRenderPipeline(material, vertex3d, fragment3d)
      })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: CoreSystems.PostMain,
        label: `renderToWebgl<${typeid(material)}>`,
        system: genRender(material)
      })
  }

  name() {
    return typeidGeneric(WebglMaterialPlugin, [this.material])
  }
}

/**
 * @template {Material & UniformBind} T
 * @typedef WebglMaterialPluginOptions
 * @property {string} vertex3d
 * @property {string} fragment3d
 * @property {Constructor<T>} material
 */
