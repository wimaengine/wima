import { App, Plugin } from '@wimaengine/app'
import { AppSchedule } from '@wimaengine/core'
import { registerColorTypes } from './systems'

export class ColorPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app.registerSystem({ schedule: AppSchedule.Startup, system: registerColorTypes })
  }
}
