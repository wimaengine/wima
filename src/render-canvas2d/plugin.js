import { App, Plugin } from '../app/index.js'
import { AppSchedule } from '../core/index.js'
import { TextureCache, BasicMaterial } from '../render-core/index.js'
import { renderBasicMaterial } from './core/index.js'
import { Canvas2DMaterialPlugin } from './plugins/index.js'
import { registerCanvas2DTypes } from './systems/index.js'

export class Canvas2DRendererPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new TextureCache())
      .registerSystem(AppSchedule.Startup, registerCanvas2DTypes)
      .registerPlugin(new Canvas2DMaterialPlugin({
        material:BasicMaterial,
        update:renderBasicMaterial
      }))
  }
}
