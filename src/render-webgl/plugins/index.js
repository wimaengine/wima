/** @import {Constructor} from '../../reflect/index.js' */
/** @import {UniformBind} from '../../render-core/index.js' */

import { App } from '../../app/app.js'
import { AppSchedule } from '../../app/schedules.js'
import { typeidGeneric } from '../../reflect/index.js'
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
      .registerSystem(AppSchedule.Startup, genRegisterBuffer(material))
      .registerSystem(AppSchedule.Update, genRenderPipeline(material, vertex3d, fragment3d))
      .registerSystem(AppSchedule.Update, genRender(material))
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