import { App, Plugin } from '../app/index.js'
import { AppSchedule } from '../core/index.js'
import { registerMathTypes } from './systems/index.js'

export class MathPlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app.registerSystem(AppSchedule.Startup, registerMathTypes)
  }
}
