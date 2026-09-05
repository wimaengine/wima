import { App, Plugin } from '@wimaengine/app'
import { CorePlugin, AppSchedule } from '@wimaengine/core'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeid } from '@wimaengine/type'
import { registerColorTypes } from './systems'

export class ColorPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app.registerSystem({ schedule: AppSchedule.Startup, system: registerColorTypes })
  }

  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin)]
  }
}
