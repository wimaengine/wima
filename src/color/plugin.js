import { App, Plugin } from '../app/index.js'
import { AppSchedule } from '../core/index.js'
import { registerColorTypes } from './systems/index.js'

export class ColorPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app.registerSystem(AppSchedule.Startup, registerColorTypes)
  }
}
