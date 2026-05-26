/** @import {Constructor} from '../../type/index.js' */
/** @import {UniformBind} from '../../render-core/index.js' */

import { App } from '../../app/app.js'
import { AppSchedule } from '../../core/core/schedules.js'
import { CoreSystems } from '../../core/core/systemgroups.js'
import { typeid, typeidGeneric } from '../../type/index.js'
import { Material } from '../../render-core/index.js'
import { genRegisterBuffer, genRender, genRenderPipeline } from '../systems/index.js'

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
