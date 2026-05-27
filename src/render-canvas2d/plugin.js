import { App, Plugin } from '../app/index.js'
import { AppSchedule, CoreSystems } from '../core/index.js'
import { TextureCache, BasicMaterial } from '../render-core/index.js'
import { renderBasicMaterial } from './core/index.js'
import { Canvas2DMaterialPlugin } from './plugins/index.js'
import { clearCanvas2d, registerCanvas2DTypes } from './systems/index.js'

export class Canvas2DRendererPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new TextureCache())
      .registerSystem({ schedule: AppSchedule.Startup, system: registerCanvas2DTypes })
      .registerSystem({
        schedule: AppSchedule.Update,
        systemGroup: CoreSystems.Start,
        system: clearCanvas2d
      })
      .registerPlugin(new Canvas2DMaterialPlugin({
        material:BasicMaterial,
        update:renderBasicMaterial
      }))
  }
}
