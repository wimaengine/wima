import { App, Plugin } from '@wimaengine/app'
import { AppSchedule } from '@wimaengine/core'
import { registerMathTypes } from './systems'

export class MathPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app.registerSystem({ schedule: AppSchedule.Startup, system: registerMathTypes })
  }
}
