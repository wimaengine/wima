import { App, Plugin } from '@wimaengine/app'
import { CorePlugin } from '@wimaengine/core'
import { ReflectPlugin } from '@wimaengine/reflect'
import { AppSchedule } from '@wimaengine/core'
import { typeid } from '@wimaengine/type'
import { registerMathTypes } from './systems'

export class MathPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app.registerSystem({ schedule: AppSchedule.Startup, system: registerMathTypes })
  }

  requires() {
    return [typeid(CorePlugin), typeid(ReflectPlugin)]
  }
}
