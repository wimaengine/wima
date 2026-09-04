import { App, Plugin } from '@wimaengine/app'
import { AppSchedule, CoreSystems, CorePlugin } from '@wimaengine/core'
import { TextureCache, BasicMaterial } from '@wimaengine/render-core'
import { ReflectPlugin } from '@wimaengine/reflect'
import { renderBasicMaterial } from './core'
import { Canvas2DMaterialPlugin } from './plugins'
import { clearCanvas2d, registerCanvas2DTypes } from './systems'
import { WindowPlugin } from '@wimaengine/window'
import { typeid } from '@wimaengine/type'

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

  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(WindowPlugin)]
  }
}
