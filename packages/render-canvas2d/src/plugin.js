import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems } from '@wimaengine/core'
import { TextureCache, BasicMaterial } from '@wimaengine/render-core'
import { renderBasicMaterial } from './core'
import { Canvas2DMaterialPlugin } from './plugins'
import { clearCanvas2d, registerCanvas2DTypes } from './systems'

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
