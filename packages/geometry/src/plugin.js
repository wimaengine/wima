import { App, Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule } from '@wimaengine/core'
import { MathPlugin } from '@wimaengine/math'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { registerGeometryTypes } from './systems'

export class GeometryPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app.registerSystem({ schedule: AppSchedule.Startup, system: registerGeometryTypes })
  }

  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin), typeid(MathPlugin)]
  }
}
